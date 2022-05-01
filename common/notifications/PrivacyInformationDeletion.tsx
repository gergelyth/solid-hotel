import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSourceUrl,
  getStringNoLocale,
  getThing,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { privacyDeletionToRdfMap } from "../vocabularies/notification_payloads/rdf_privacyDeletion";

export function DeserializePrivacyInformationDeletion(dataset: SolidDataset): {
  tokenUrl: string;
  guestInboxUrl: string | undefined;
} {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const deletionThing = getThing(dataset, datasetUrl + "#privacyTokenDeletion");
  if (!deletionThing) {
    throw new Error("Deletion thing is null");
  }

  const tokenUrl =
    getStringNoLocale(deletionThing, privacyDeletionToRdfMap.tokenUrl) ?? null;
  const guestInboxUrl =
    getStringNoLocale(deletionThing, privacyDeletionToRdfMap.guestInboxUrl) ??
    undefined;

  if (!tokenUrl) {
    throw new Error("Privacy token URL link cannot be null");
  }

  return { tokenUrl, guestInboxUrl };
}

export function SerializePrivacyInformationDeletion(
  tokenUrl: string,
  guestInboxUrl?: string
): SolidDataset {
  let deletionDataset = createSolidDataset();

  let deletionThing = createThing({ name: "privacyTokenDeletion" });
  deletionThing = addStringNoLocale(
    deletionThing,
    privacyDeletionToRdfMap.tokenUrl,
    tokenUrl
  );
  if (guestInboxUrl) {
    deletionThing = addStringNoLocale(
      deletionThing,
      privacyDeletionToRdfMap.guestInboxUrl,
      guestInboxUrl
    );
  }

  deletionDataset = setThing(deletionDataset, deletionThing);
  const notificationDataset = AddNotificationThingToDataset(
    deletionDataset,
    NotificationType.PrivacyTokenDeletion
  );

  return notificationDataset;
}
