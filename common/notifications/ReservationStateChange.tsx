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
import { AddNotificationThingToDataset } from "../util/solidCommon";
import { NotificationType } from "../types/NotificationsType";

export function DeserializeReservationStateChange(
  url: string,
  dataset: SolidDataset
): {
  reservationId: string;
  newState: ReservationState;
  replyInbox: string;
} {
  //TODO perhaps we should define a general serializer/deserializer
  const stateChangeThing = getThing(dataset, "#reservationStateChange");
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
    throw new Error("Reservation ID empty. Wrong inbox URL parsing logic.");
  }

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
    reservationStateChangeToRdfMap.state,
    newState.valueOf()
  );

  requestDataset = setThing(requestDataset, request);

  AddNotificationThingToDataset(
    requestDataset,
    NotificationType.ReservationStateChange
  );

  return requestDataset;
}
