import { SolidDataset } from "@inrupt/solid-client";
import { SetReservationStateAndInbox } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { DeserializeFailureReport } from "../../common/notifications/FailureReport";

export function ReceiveReservationStateChange(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, newState, replyInbox } =
    DeserializeReservationStateChange(url, dataset);
  const text = `The state ${newState.toString()} was set for reservation ${reservationId}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    //TODO we should set the page in VerifyingComponent in different workflows so they don't wait - but how
    SetReservationStateAndInbox(reservationId, newState, replyInbox);
  };

  return { text, onClick, onReceive };
}

export function ReceiveFailureReport(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, errorMessage, resultState } = DeserializeFailureReport(
    url,
    dataset
  );
  const text = `There was an error processing the reservation state change request: ${errorMessage}.
        The state is left at ${resultState.toString()}.
        Click to view reservation.`;
  const onClick = (): void => {
    router.push(`/reservations/${encodeURIComponent(reservationId)}`);
  };
  const onReceive = (): void => {
    //if we don't set the ReservationState of the reservation to something else before the request, there is no need to do anything here
    //if we do, we need to change that to resultState here
  };

  return { text, onClick, onReceive };
}
