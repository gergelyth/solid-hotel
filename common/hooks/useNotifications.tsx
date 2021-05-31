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
import { ParseReservationStateChange } from "../notifications/ReservationStateChange";

const swrKey = "notifications";

enum NotificationType {
  ReservationStateChange,
}

function BuildNotificationBasedOnType(
  url: string,
  dataset: SolidDataset,
  notificationThing: Thing,
  notificationType: NotificationType,
  payloadThing: Thing | null
): Notification {
  const router = useRouter();

  let isProcessed = getBoolean(
    notificationThing,
    notificationToRdfMap.isProcessed
  );
  if (!isProcessed) {
    throw new Error("IsProcessed field is null in notification");
  }

  let text: string;
  let onClick: (event: React.MouseEvent<EventTarget>) => void;
  let onReceive: () => void;
  switch (notificationType) {
    case NotificationType.ReservationStateChange:
      ({ text, onClick, onReceive } = ParseReservationStateChange(
        router,
        url,
        payloadThing
      ));
      break;

    default:
      throw new Error("Notification type unrecognized");
  }

  onReceive = () => {
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
    onReceive: onReceive,
  };
}

function ConvertToNotification(
  dataset: SolidDataset,
  url: string
): Notification | null {
  const notificationThing = getThing(dataset, url + "#notification");
  if (!notificationThing) {
    return null;
  }
  const notificationType: NotificationType =
    getInteger(notificationThing, notificationToRdfMap.state) ?? 0;

  const payloadThing = getThing(dataset, url + "#payload");

  return BuildNotificationBasedOnType(
    url,
    dataset,
    notificationThing,
    notificationType,
    payloadThing
  );
}

function RetrieveNotifications(
  inboxAddress: string
): {
  items: (Notification | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  return FetchItems<Notification>(swrKey, inboxAddress, ConvertToNotification);
}

export function useNotifications(
  inboxList: string[]
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
} {
  const notifications: (Notification | null)[] = [];
  let isAnyLoading = false;
  let isAnyError = false;

  inboxList.forEach((inboxAddress: string) => {
    const { items, isLoading, isError } = RetrieveNotifications(inboxAddress);
    if (items) {
      notifications.concat(items);
    }

    isAnyLoading = isAnyLoading || isLoading;
    isAnyError = isAnyError || isError;
  });

  return { items: notifications, isLoading: isAnyLoading, isError: isAnyError };
}
