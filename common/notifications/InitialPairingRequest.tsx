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
import { initialPairingRequestRdfMap } from "../vocabularies/notification_payloads/rdf_initialPairingRequest";
import { pairingTokenToRdfMap } from "../vocabularies/rdf_pairingToken";

/**
 * Parses the notification dataset into an initial pairing request submitted by the guest.
 * @returns The token of the pairing operation and the inbox URL where the hotel can reply.
 */
export function DeserializeInitialPairingRequest(dataset: SolidDataset): {
  guestInboxUrl: string;
  token: string;
} {
  const url = getSourceUrl(dataset);
  const requestThing = getThing(dataset, url + "#pairingRequest");
  if (!requestThing) {
    throw new Error("Initial pairing request thing cannot be null");
  }

  const guestInboxUrl = getStringNoLocale(
    requestThing,
    initialPairingRequestRdfMap.guestInboxUrl
  );
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL is null in initial pairing request");
  }

  const token = getStringNoLocale(
    requestThing,
    pairingTokenToRdfMap.pairingToken
  );
  if (!token) {
    throw new Error("Pairing token is null in initial pairing request");
  }

  return { guestInboxUrl: guestInboxUrl, token: token };
}

/**
 * Serializes the reply inbox URL and the secret token for the pairing operation and creates an initial pairing request notification dataset with it.
 * @returns The initial pairing request dataset.
 */
export function SerializeInitialPairingRequest(
  guestInboxUrl: string,
  token: string
): SolidDataset {
  //TODO need pairing token here as well
  let initialRequestDataset = createSolidDataset();

  let requestThing = createThing({ name: "pairingRequest" });
  requestThing = addStringNoLocale(
    requestThing,
    initialPairingRequestRdfMap.guestInboxUrl,
    guestInboxUrl
  );

  requestThing = addStringNoLocale(
    requestThing,
    pairingTokenToRdfMap.pairingToken,
    token
  );

  initialRequestDataset = setThing(initialRequestDataset, requestThing);
  const notificationDataset = AddNotificationThingToDataset(
    initialRequestDataset,
    NotificationType.InitialPairingRequest
  );

  return notificationDataset;
}
