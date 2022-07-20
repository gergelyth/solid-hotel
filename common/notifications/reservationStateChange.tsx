import {
  addInteger,
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getInteger,
  getStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { ReservationState } from "../types/ReservationState";
import { ReservationStateChangeToRdfMap } from "../vocabularies/notificationpayloads/rdfReservationStateChange";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { GetReservationIdFromInboxUrl } from "../util/urlParser";
import { GetThing } from "../util/solid";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/**
 * Parses the notification dataset into the reservation state change properties.
 * @returns The reservation state change properties: the reservation ID, the new state of the reservation and the reply inbox which receives any follow-up messages.
 */
export function DeserializeReservationStateChange(
  url: string,
  dataset: SolidDataset
): {
  reservationId: string;
  newState: ReservationState;
  replyInbox: string;
} {
  const stateChangeThing = GetThing(dataset, "reservationStateChange");
  if (!stateChangeThing) {
    throw new Error("State change thing cannot be null");
  }

  const newStateValue = getInteger(
    stateChangeThing,
    ReservationStateChangeToRdfMap.newState
  );
  if (!newStateValue) {
    throw new Error(
      "New state value is null in reservation change notification"
    );
  }
  const newState: ReservationState = newStateValue;

  const replyInbox = getStringNoLocale(
    stateChangeThing,
    ReservationStateChangeToRdfMap.replyInbox
  );
  if (!replyInbox) {
    throw new Error(
      "Reply inbox value is null in reservation change notification"
    );
  }

  const reservationId = GetReservationIdFromInboxUrl(url);
  return { reservationId, newState, replyInbox };
}

/**
 * Serializes the reservation state change properties and creates a notification dataset with it.
 * @returns The reservation state change notification dataset.
 */
export function SerializeReservationStateChange(
  replyInbox: string,
  newState: ReservationState
): SolidDataset {
  let requestDataset = createSolidDataset();

  let request = createThing({ name: "reservationStateChange" });
  request = addUrl(
    request,
    UtilRdfMap.type,
    ReservationStateChangeToRdfMap.type
  );
  request = addStringNoLocale(
    request,
    ReservationStateChangeToRdfMap.replyInbox,
    replyInbox
  );
  request = addInteger(
    request,
    ReservationStateChangeToRdfMap.newState,
    newState.valueOf()
  );

  requestDataset = setThing(requestDataset, request);

  const notificationDataset = AddNotificationThingToDataset(
    requestDataset,
    NotificationType.ReservationStateChange
  );

  return notificationDataset;
}
