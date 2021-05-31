import { getInteger, getStringNoLocale, Thing } from "@inrupt/solid-client";
import { ReservationState } from "../types/ReservationState";
import { SetReservationStateAndInbox } from "../util/solid";
import { NextRouter } from "next/router";
import { reservationStateChangeToRdfMap } from "../vocabularies/notification_payloads/rdf_reservationStateChange";

export function ParseReservationStateChange(
  router: NextRouter,
  url: string,
  payloadThing: Thing | null
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  if (!payloadThing) {
    throw new Error("Payload cannot be null");
  }
  const newStateValue = getInteger(
    payloadThing,
    reservationStateChangeToRdfMap.newState
  );
  if (!newStateValue) {
    throw new Error(
      "New state value is null in reservation change notification"
    );
  }
  const newState: ReservationState = newStateValue;

  const replyInbox = getStringNoLocale(
    payloadThing,
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

  const text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
  const onClick = () => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = () => {
    //TODO we should set the page in VerifyingComponent in different workflows so they don't wait - but how
    SetReservationStateAndInbox(reservationId, newState, replyInbox);
  };

  return { text, onClick, onReceive };
}
