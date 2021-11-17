import {
  saveSolidDatasetAt,
  setBoolean,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { useNotifications } from "../hooks/useNotifications";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { Notification } from "../types/Notification";
import { GetSession } from "./solid";
import { ParserList } from "../types/ParserList";

export function RetrieveAllNotifications(
  coreUrl: string | null,
  inboxRegexList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
} {
  const notificationsRetrieval = useNotifications(
    coreUrl,
    inboxRegexList,
    parsers
  );
  TriggerOnReceivedLogic(notificationsRetrieval.items);
  return notificationsRetrieval;
}

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

export async function SetIsProcessedForNotification(
  datasetUrl: string,
  notificationDataset: SolidDataset,
  notification: Thing,
  session: Session = GetSession()
): Promise<void> {
  notification = setBoolean(
    notification,
    notificationToRdfMap.isProcessed,
    true
  );
  const updatedDataSet = setThing(notificationDataset, notification);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}
