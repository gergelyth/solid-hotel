import { SolidDataset } from "@inrupt/solid-client";
import { SetReservationStateAndInbox } from "../../common/util/solid";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/ReservationStateChange";

export function ReceiveReservationStateChange(
  router: NextRouter,
  url: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const {
    reservationId,
    newState,
    replyInbox,
  } = DeserializeReservationStateChange(url, dataset);
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
