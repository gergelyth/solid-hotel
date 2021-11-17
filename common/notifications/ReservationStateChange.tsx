import {
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getInteger,
  getStringNoLocale,
  getThing,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { ReservationState } from "../types/ReservationState";
import { reservationStateChangeToRdfMap } from "../vocabularies/notification_payloads/rdf_reservationStateChange";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { GetReservationIdFromInboxUrl } from "../util/urlParser";

export function DeserializeReservationStateChange(
  url: string,
  dataset: SolidDataset
): {
  reservationId: string;
  newState: ReservationState;
  replyInbox: string;
} {
  //TODO perhaps we should define a general serializer/deserializer
  const stateChangeThing = getThing(dataset, url + "#reservationStateChange");
  if (!stateChangeThing) {
    throw new Error("State change thing cannot be null");
  }

  const newStateValue = getInteger(
    stateChangeThing,
    reservationStateChangeToRdfMap.newState
  );
  if (!newStateValue) {
    throw new Error(
      "New state value is null in reservation change notification"
    );
  }
  const newState: ReservationState = newStateValue;

  const replyInbox = getStringNoLocale(
    stateChangeThing,
    reservationStateChangeToRdfMap.replyInbox
  );
  if (!replyInbox) {
    throw new Error(
      "Reply inbox value is null in reservation change notification"
    );
  }

  const reservationId = GetReservationIdFromInboxUrl(url);
  return { reservationId, newState, replyInbox };
}

export function SerializeReservationStateChange(
  replyInbox: string,
  newState: ReservationState
): SolidDataset {
  let requestDataset = createSolidDataset();

  let request = createThing({ name: "reservationStateChange" });
  request = addStringNoLocale(
    request,
    reservationStateChangeToRdfMap.replyInbox,
    replyInbox
  );
  request = addInteger(
    request,
    reservationStateChangeToRdfMap.newState,
    newState.valueOf()
  );

  requestDataset = setThing(requestDataset, request);

  const notificationDataset = AddNotificationThingToDataset(
    requestDataset,
    NotificationType.ReservationStateChange
  );

  return notificationDataset;
}
