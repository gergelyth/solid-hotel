import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  getThing,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/solidCommon";
import { NotificationType } from "../types/NotificationsType";
import { initialPairingRequestRdfMap } from "../vocabularies/notification_payloads/rdf_initialPairingRequest";

export function DeserializeInitialPairingRequest(dataset: SolidDataset): {
  guestInboxUrl: string;
} {
  const requestThing = getThing(dataset, "#pairingRequest");
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

  return { guestInboxUrl: guestInboxUrl };
}

export function SerializeInitialPairingRequest(
  guestInboxUrl: string
): SolidDataset {
  //TODO need pairing token here as well
  let initialRequestDataset = createSolidDataset();

  let requestThing = createThing({ name: "pairingRequest" });
  requestThing = addStringNoLocale(
    requestThing,
    initialPairingRequestRdfMap.guestInboxUrl,
    guestInboxUrl
  );

  initialRequestDataset = setThing(initialRequestDataset, requestThing);
  const notificationDataset = AddNotificationThingToDataset(
    initialRequestDataset,
    NotificationType.InitialPairingRequest
  );

  return notificationDataset;
}
