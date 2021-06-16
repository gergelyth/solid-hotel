import {
  getBoolean,
  getInteger,
  getThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { Notification } from "../types/Notification";
import { useRouter } from "next/router";
import { SetIsProcessedForNotification } from "../util/notifications";
import { NotificationParser } from "../types/NotificationParser";
import { NotificationType } from "../types/NotificationsType";
import { ParserList } from "../types/ParserList";

const swrKey = "notifications";

function BuildNotificationBasedOnType(
  url: string,
  dataset: SolidDataset,
  notificationThing: Thing,
  parser: NotificationParser
): Notification {
  const router = useRouter();

  let isProcessed = getBoolean(
    notificationThing,
    notificationToRdfMap.isProcessed
  );
  if (!isProcessed) {
    throw new Error("IsProcessed field is null in notification");
  }

  const { text, onClick, onReceive } = parser(router, url, dataset);

  const expandedOnReceive = (): void => {
    onReceive();
    isProcessed = true;
    SetIsProcessedForNotification(url, dataset, notificationThing);
    //TODO do we need revalidate here? like in edit-room-popup
  };

  return {
    notificationUrl: url,
    isProcessed: isProcessed,
    text: text,
    onClick: onClick,
    onReceive: expandedOnReceive,
  };
}

function ConvertToNotification(
  dataset: SolidDataset,
  url: string,
  parsers: ParserList
): Notification | null {
  const notificationThing = getThing(dataset, "#notification");
  if (!notificationThing) {
    return null;
  }

  //TODO default value
  const notificationType: NotificationType =
    getInteger(notificationThing, notificationToRdfMap.state) ?? 0;
  const parser = parsers[notificationType];
  if (!parser) {
    throw new Error(
      "No parser found for NotificationType: " + notificationType.toString()
    );
  }

  return BuildNotificationBasedOnType(url, dataset, notificationThing, parser);
}

function RetrieveNotifications(
  inboxAddress: string,
  parsers: ParserList
): {
  items: (Notification | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  return FetchItems<Notification>(swrKey, inboxAddress, (dataset, url) =>
    ConvertToNotification(dataset, url, parsers)
  );
}

export function useNotifications(
  inboxList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
} {
  const notifications: (Notification | null)[] = [];
  let isAnyLoading = false;
  let isAnyError = false;

  inboxList.forEach((inboxAddress: string) => {
    const { items, isLoading, isError } = RetrieveNotifications(
      inboxAddress,
      parsers
    );
    if (items) {
      notifications.concat(items);
    }

    isAnyLoading = isAnyLoading || isLoading;
    isAnyError = isAnyError || isError;
  });

  return { items: notifications, isLoading: isAnyLoading, isError: isAnyError };
}