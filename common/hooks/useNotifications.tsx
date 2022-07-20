import {
  getBoolean,
  getContainedResourceUrlAll,
  getDatetime,
  getUrl,
  SolidDataset,
  Thing,
  UrlString,
} from "@inrupt/solid-client";
import { NotificationToRdfMap } from "../vocabularies/rdfNotification";
import { Notification } from "../types/Notification";
import { NextRouter, useRouter } from "next/router";
import { SetIsProcessedForNotification } from "../util/notifications";
import { NotificationParser } from "../types/NotificationParser";
import { NotificationType } from "../types/NotificationsType";
import { ParserList } from "../types/ParserList";
import { GetDataSet, GetThing } from "../util/solid";
import useSWR, { mutate } from "swr";
import { GlobSolidUrlPaths } from "../util/helpers";
import { ReverseNotificationTypeRdfMap } from "../vocabularies/notificationpayloads/rdfNotificationTypes";

const swrKey = "notifications";

/**
 * Parses the notification,
 * Common properties are parsed here, notification type specific property parsing is delegated to the parser.
 * Extends the OnReceive() function received back from the parser to set the isProcessed flag when OnReceive() logic was run.
 * @returns The parsed {@link Notification} object.
 */
function BuildNotificationBasedOnType(
  url: string,
  dataset: SolidDataset,
  notificationThing: Thing,
  notificationType: NotificationType,
  parser: NotificationParser,
  router: NextRouter
): Notification {
  const isProcessed = getBoolean(
    notificationThing,
    NotificationToRdfMap.isProcessed
  );
  if (isProcessed == null) {
    throw new Error("IsProcessed field is null in notification");
  }

  const createdAt = getDatetime(
    notificationThing,
    NotificationToRdfMap.createdAt
  );
  if (createdAt == null) {
    throw new Error("CreatedAt field is null in notification");
  }

  const { text, onClick, onReceive } = parser(router, url, dataset);

  const notification: Notification = {
    notificationUrl: url,
    isProcessed: isProcessed,
    type: notificationType,
    text: text,
    createdAt: createdAt,
    onClick: onClick,
    onReceive: onReceive,
  };

  const expandedOnReceive = (): void => {
    onReceive();
    notification.isProcessed = true;
    console.log("processed");
    SetIsProcessedForNotification(url, dataset, notificationThing);
    //TODO do we need revalidate here? like in edit-room-popup
  };
  notification.onReceive = expandedOnReceive;

  return notification;
}

/**
 * Determines the notification parser based on the type of the notification and triggers further processing.
 * @returns A {@link Notification} object or null (if there's an issue with the dataset).
 */
function ConvertToNotification(
  dataset: SolidDataset,
  url: string,
  parsers: ParserList,
  router: NextRouter
): Notification | null {
  const notificationThing = GetThing(dataset, "notification");
  if (!notificationThing) {
    return null;
  }

  //TODO default value
  let notificationType: NotificationType =
    ReverseNotificationTypeRdfMap[
      getUrl(notificationThing, NotificationToRdfMap.notificationType) ?? 0
    ];
  //Annoying retyping trick so we get a correct ENUM value instead of a string
  notificationType =
    NotificationType[
      NotificationType[notificationType] as keyof typeof NotificationType
    ];

  const parser = parsers[notificationType];
  if (!parser) {
    throw new Error(
      "No parser found for NotificationType: " + notificationType.toString()
    );
  }

  return BuildNotificationBasedOnType(
    url,
    dataset,
    notificationThing,
    notificationType,
    parser,
    router
  );
}

/**
 * Fetches the notification resouce and converts them based on the function passed.
 * @returns A {@link Notification} object or null (if there's an issue with the dataset).
 */
function ProcessItem<T>(
  url: UrlString,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): Promise<T | null> {
  return GetDataSet(url).then((dataset) => {
    return convertToType(dataset, url);
  });
}

//TODO put this logic in static render so it's not calculated everytime, just on startup - we can't do this because reservations can get created on the fly
//probably getserversideProps we can - just put this into a constant a generate if it's undefined
/**
 * Resolves the inbox paths by concatenating them with the pod URL and expanding wildcard inbox paths.
 * @returns A list of absolute inbox URL paths to retrieve notifications from.
 */
async function GetUrlPaths(
  coreUrl: string | null,
  inboxRegexList: string[]
): Promise<string[]> {
  let urlPaths: string[] = [];
  if (!coreUrl) {
    throw new Error("Not signed in");
  }
  const resourceCache: { [url: string]: string[] } = {};
  const promises = inboxRegexList.map((inboxRegex) => {
    const fullUrl = coreUrl + inboxRegex;
    if (inboxRegex.includes("*")) {
      return GlobSolidUrlPaths(fullUrl, resourceCache).then((paths) => {
        urlPaths = urlPaths.concat(paths);
      });
    } else {
      urlPaths.push(fullUrl);
    }
  });

  return Promise.all(promises).then(() => urlPaths);
}

/**
 * Fetches the notifications in the given container.
 * Converts them to {@link Notification} objects according to the function passed.
 * @returns The array of {@link Notification} objects retrieved from the container.
 */
function GetNotificationsForSpecificUrl<T>(
  url: string,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): Promise<(T | null)[]> {
  return GetDataSet(url).then((dataset) => {
    const urls = getContainedResourceUrlAll(dataset);
    const items = urls.map((itemUrl) => {
      return ProcessItem<T>(itemUrl, convertToType);
    });
    return Promise.all(items);
  });
}

//TODO this a quickfix for hook order calling
/**
 * Fetches the notifications contained in the inboxes specified.
 * The inbox list is passed as an array of relative URL paths with a potential `*` wildcard contained in them - this is expanded to mean all resources.
 * The fetched notifications are then converted to {@link Notification} objects according to the convertToType function.
 * If the coreUrl is not passed to the method, the SWR hook is not called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The notifications and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
function FetchItemsArray<T>(
  swrKey: string,
  coreUrl: string | null,
  inboxRegexList: string[],
  convertToType: (dataset: SolidDataset, url: string) => T | null
): {
  items: (T | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  const fetcher = async (
    _: string,
    coreUrl: string | null,
    inboxRegexList: string[]
  ): Promise<(T | null)[]> => {
    let notifications: (T | null)[] = [];
    const urlPaths = await GetUrlPaths(coreUrl, inboxRegexList);

    const promises = urlPaths.map((inboxAddress: string) => {
      return GetNotificationsForSpecificUrl<T>(
        inboxAddress,
        convertToType
      ).then((notificationsForSpecificUrl) => {
        notifications = notifications.concat(notificationsForSpecificUrl);
      });
    });

    return Promise.all(promises).then(() => notifications);
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments

  const { data, error, isValidating } = useSWR(
    [swrKey, coreUrl, inboxRegexList],
    fetcher
  );
  return {
    items: data,
    isLoading: !error && !data,
    isError: error,
    isValidating: isValidating,
  };
}

/**
 * Fetches the notifications contained in the inboxes specified.
 * The inbox list is passed as an array of relative URL paths with a potential `*` wildcard contained in them - this is expanded to mean all resources.
 * The parsers passed to the method are used to create the text field and onClick and onReceive functions based on the type of the notification.
 * If the podUrl is not passed to the method, the SWR hook is not called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The notifications and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
export function useNotifications(
  podUrl: string | null,
  inboxRegexList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  const router = useRouter();
  const fetch = FetchItemsArray<Notification>(
    swrKey,
    podUrl,
    inboxRegexList,
    (dataset, url) => ConvertToNotification(dataset, url, parsers, router)
  );

  return {
    items: fetch.items ?? [],
    isLoading: fetch.isLoading,
    isError: fetch.isError,
    isValidating: fetch.isValidating,
  };
}

/**
 * Triggers a refetch of notifications.
 */
export function RevalidateNotifications(
  podUrl: string | null,
  inboxRegexList: string[]
): void {
  mutate([swrKey, podUrl, inboxRegexList]);
}
