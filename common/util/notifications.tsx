import {
  setBoolean,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { useNotifications } from "../hooks/useNotifications";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { Notification } from "../types/Notification";
import { ParserList } from "../types/ParserList";
import { SafeSaveDatasetAt } from "./solidWrapper";

/**
 * Calls the {@link useNotifications} hook to retrieve all notifications contained in the inboxes specified.
 * The inbox list is passed as an array of relative URL paths with a potential `*` wildcard contained in them.
 * The parsers passed to the method are used to create the text field and onClick and onReceive functions based on the type of the notification.
 * The onReceive() functions are triggered for those notifications whose isProcessed flag is not set to true yet.
 * @returns The notifications and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
export function RetrieveAllNotifications(
  coreUrl: string | null,
  inboxRegexList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  const notificationsRetrieval = useNotifications(
    coreUrl,
    inboxRegexList,
    parsers
  );
  TriggerOnReceivedLogic(notificationsRetrieval.items);
  return notificationsRetrieval;
}

/**
 * Calls the onReceive() functions for those notifications whose isProcessed flag is not set to true yet.
 */
function TriggerOnReceivedLogic(notifications: (Notification | null)[]): void {
  if (!notifications) {
    return;
  }

  notifications.forEach((notification) => {
    if (!notification?.isProcessed) {
      notification?.onReceive();
    }
  });
}

/**
 * Sets the isProcessed flag to true for a given notification dataset.
 * Updates the notification in the Solid Pod.
 */
export async function SetIsProcessedForNotification(
  datasetUrl: string,
  notificationDataset: SolidDataset,
  notification: Thing
): Promise<void> {
  notification = setBoolean(
    notification,
    notificationToRdfMap.isProcessed,
    true
  );
  const updatedDataSet = setThing(notificationDataset, notification);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}
