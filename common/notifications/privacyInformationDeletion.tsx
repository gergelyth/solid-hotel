import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getSourceUrl,
  getStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { PrivacyDeletionToRdfMap } from "../vocabularies/notificationpayloads/rdfPrivacyDeletion";
import { GetThing } from "../util/solid";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/**
 * Parses the notification dataset into a privacy token deletion request.
 * @returns The token URL of the privacy token to be deleted and an optional guest inbox where the hotel can report the successful operation.
 */
export function DeserializePrivacyInformationDeletion(dataset: SolidDataset): {
  tokenUrl: string;
  guestInboxUrl: string | undefined;
} {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const deletionThing = GetThing(dataset, "#privacyTokenDeletion");
  if (!deletionThing) {
    throw new Error("Deletion thing is null");
  }

  const tokenUrl =
    getStringNoLocale(deletionThing, PrivacyDeletionToRdfMap.tokenUrl) ?? null;
  const guestInboxUrl =
    getStringNoLocale(deletionThing, PrivacyDeletionToRdfMap.guestInboxUrl) ??
    undefined;

  if (!tokenUrl) {
    throw new Error("Privacy token URL link cannot be null");
  }

  return { tokenUrl, guestInboxUrl };
}

/**
 * Serializes the privacy token URL and an optional reply inbox argument to create the privacy token deletion request notification.
 * @returns The privacy token deletion request notification dataset.
 */
export function SerializePrivacyInformationDeletion(
  tokenUrl: string,
  guestInboxUrl?: string
): SolidDataset {
  let deletionDataset = createSolidDataset();

  let deletionThing = createThing({ name: "privacyTokenDeletion" });
  deletionThing = addUrl(
    deletionThing,
    UtilRdfMap.type,
    PrivacyDeletionToRdfMap.type
  );
  deletionThing = addStringNoLocale(
    deletionThing,
    PrivacyDeletionToRdfMap.tokenUrl,
    tokenUrl
  );
  if (guestInboxUrl) {
    deletionThing = addStringNoLocale(
      deletionThing,
      PrivacyDeletionToRdfMap.guestInboxUrl,
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
