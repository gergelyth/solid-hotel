import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { InitialPairingRequestRdfMap } from "../vocabularies/notificationpayloads/rdfInitialPairingRequest";
import { PairingTokenToRdfMap } from "../vocabularies/rdfPairingToken";
import { GetThing } from "../util/solid";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/**
 * Parses the notification dataset into an initial pairing request submitted by the guest.
 * @returns The token of the pairing operation and the inbox URL where the hotel can reply.
 */
export function DeserializeInitialPairingRequest(dataset: SolidDataset): {
  guestInboxUrl: string;
  token: string;
} {
  const requestThing = GetThing(dataset, "pairingRequest");
  if (!requestThing) {
    throw new Error("Initial pairing request thing cannot be null");
  }

  const guestInboxUrl = getStringNoLocale(
    requestThing,
    InitialPairingRequestRdfMap.guestInboxUrl
  );
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL is null in initial pairing request");
  }

  const token = getStringNoLocale(
    requestThing,
    PairingTokenToRdfMap.pairingToken
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
  requestThing = addUrl(
    requestThing,
    UtilRdfMap.type,
    InitialPairingRequestRdfMap.type
  );
  requestThing = addStringNoLocale(
    requestThing,
    InitialPairingRequestRdfMap.guestInboxUrl,
    guestInboxUrl
  );

  requestThing = addStringNoLocale(
    requestThing,
    PairingTokenToRdfMap.pairingToken,
    token
  );

  initialRequestDataset = setThing(initialRequestDataset, requestThing);
  const notificationDataset = AddNotificationThingToDataset(
    initialRequestDataset,
    NotificationType.InitialPairingRequest
  );

  return notificationDataset;
}
