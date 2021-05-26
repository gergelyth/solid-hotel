import {
  getBoolean,
  getInteger,
  getStringNoLocale,
  getThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { FetchItems } from "./util/listThenItemsFetcher";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { ReservationState } from "../types/ReservationState";
import { Notification } from "../types/Notification";
import { SetReservationStateAndInbox } from "../util/solid";
import { useRouter } from "next/router";

const swrKey = "notifications";

enum NotificationType {
  ReservationStateChange,
}

function BuildNotificationBasedOnType(
  url: string,
  notificationThing: Thing,
  notificationType: NotificationType
): Notification {
  const router = useRouter();

  const isProcessed = getBoolean(
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
      {
        const newStateValue = getInteger(
          notificationThing,
          notificationToRdfMap.newState
        );
        if (!newStateValue) {
          throw new Error(
            "New state value is null in reservation change notification"
          );
        }
        const newState: ReservationState = newStateValue;

        const replyInbox = getStringNoLocale(
          notificationThing,
          notificationToRdfMap.replyInbox
        );
        if (!replyInbox) {
          throw new Error(
            "Reply inbox value is null in reservation change notification"
          );
        }

        //TODO this is not very robust
        //structure:
        //userpod.inrupt.net/reservations/49938104/reservation
        //userpod.inrupt.net/reservations/49938104/inbox
        const urlParts = url.split("/");
        if (!urlParts.pop()) {
          //pop one more (now the inbox part for sure) if there was a trailing slash
          urlParts.pop();
        }
        const reservationId = urlParts.pop();
        if (!reservationId) {
          throw new Error(
            "Reservation ID empty. Wrong inbox URL parsing logic."
          );
        }

        text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
        onClick = () => {
          router.push(`/reservations/${encodeURIComponent(reservationId)}`);
        };
        onReceive = () => {
          SetReservationStateAndInbox(reservationId, newState, replyInbox);
        };
      }
      break;

    default:
      throw new Error("Notification type unrecognized");
  }

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

  return BuildNotificationBasedOnType(url, notificationThing, notificationType);
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
