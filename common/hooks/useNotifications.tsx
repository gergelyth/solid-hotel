import {
  getBoolean,
  getContainedResourceUrlAll,
  getDecimal,
  getInteger,
  getThing,
  SolidDataset,
  Thing,
  UrlString,
} from "@inrupt/solid-client";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { Notification } from "../types/Notification";
import { NextRouter, useRouter } from "next/router";
import { SetIsProcessedForNotification } from "../util/notifications";
import { NotificationParser } from "../types/NotificationParser";
import { NotificationType } from "../types/NotificationsType";
import { ParserList } from "../types/ParserList";
import { GetDataSet } from "../util/solid";
import useSWR, { mutate } from "swr";
import { GlobSolidUrlPaths } from "../util/helpers";

const swrKey = "notifications";

function BuildNotificationBasedOnType(
  url: string,
  dataset: SolidDataset,
  modTime: number,
  notificationThing: Thing,
  parser: NotificationParser,
  router: NextRouter
): Notification {
  const isProcessed = getBoolean(
    notificationThing,
    notificationToRdfMap.isProcessed
  );
  if (isProcessed == null) {
    throw new Error("IsProcessed field is null in notification");
  }

  const { text, onClick, onReceive } = parser(router, url, dataset);

  const notification: Notification = {
    notificationUrl: url,
    isProcessed: isProcessed,
    text: text,
    lastModTime: modTime,
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

function ConvertToNotification(
  dataset: SolidDataset,
  url: string,
  modTime: number,
  parsers: ParserList,
  router: NextRouter
): Notification | null {
  const notificationThing = getThing(dataset, url + "#notification");
  if (!notificationThing) {
    return null;
  }

  //TODO default value
  const notificationType: NotificationType =
    getInteger(notificationThing, notificationToRdfMap.notificationType) ?? 0;
  const parser = parsers[notificationType];
  if (!parser) {
    throw new Error(
      "No parser found for NotificationType: " + notificationType.toString()
    );
  }

  return BuildNotificationBasedOnType(
    url,
    dataset,
    modTime,
    notificationThing,
    parser,
    router
  );
}

function ProcessItem<T>(
  url: UrlString,
  modTime: number,
  convertToType: (
    dataset: SolidDataset,
    modTime: number,
    url: string
  ) => T | null
): Promise<T | null> {
  return GetDataSet(url).then((dataset) => {
    return convertToType(dataset, modTime, url);
  });
}

//TODO put this logic in static render so it's not calculated everytime, just on startup - we can't do this because reservations can get created on the fly
//probably getserversideProps we can
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

function CollectModifyDates(
  dataset: SolidDataset,
  urls: string[]
): [string, number][] {
  const result: [string, number][] = [];
  urls.forEach((url) => {
    const itemThing = getThing(dataset, url);
    if (!itemThing) {
      throw new Error(
        "Supposedly contained item not found in the Solid folder"
      );
    }

    //TODO extract this into a const (not in our custom RDF maps, just here probably)
    const mTime = getDecimal(itemThing, "stat:mtime");
    if (!mTime) {
      throw new Error(
        "MTime in a notification item is null. That shouldn't be possible, right?"
      );
    }
    result.push([url, mTime]);
  });

  return result;
}

function GetNotificationsForSpecificUrl<T>(
  url: string,
  convertToType: (
    dataset: SolidDataset,
    modTime: number,
    url: string
  ) => T | null
): Promise<(T | null)[]> {
  return GetDataSet(url).then((dataset) => {
    const urls = getContainedResourceUrlAll(dataset);
    const urlToModTime = CollectModifyDates(dataset, urls);
    const items = urlToModTime.map(([itemUrl, modTime]) => {
      return ProcessItem<T>(itemUrl, modTime, convertToType);
    });
    return Promise.all(items);
  });
}

//TODO this a quickfix for hook order calling
function FetchItemsArray<T>(
  swrKey: string,
  coreUrl: string | null,
  inboxRegexList: string[],
  convertToType: (
    dataset: SolidDataset,
    modTime: number,
    url: string
  ) => T | null
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

export function useNotifications(
  podUrl: string | null,
  inboxRegexList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
} {
  const router = useRouter();
  const fetch = FetchItemsArray<Notification>(
    swrKey,
    podUrl,
    inboxRegexList,
    (dataset, modTime, url) =>
      ConvertToNotification(dataset, url, modTime, parsers, router)
  );

  return {
    items: fetch.items ?? [],
    isLoading: fetch.isLoading,
    isError: fetch.isError,
  };
}

export function RevalidateNotifications(
  podUrl: string | null,
  inboxRegexList: string[]
): void {
  mutate([swrKey, podUrl, inboxRegexList]);
}
