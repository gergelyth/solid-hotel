import { ReservationState } from "../../common/types/ReservationState";
import {
  GetOwnerFromReservation,
  SetReservationStateAndInbox,
} from "../../common/util/solid_reservations";
import {
  ConfirmReservationStateRequest,
  ReportFailureToGuest,
} from "./outgoingCommunications";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";
import { ShowCustomSnackbar } from "../../common/components/snackbar";
import CheckinProgressSnackbar from "../components/checkin/checkin-progress-snackbar";
import CheckoutProgressSnackbar from "../components/checkout/checkout-progress-snackbar";
import CancelProgressSnackbar from "../components/cancelation/cancel-progress-snackbar";
import { RevalidateReservations } from "../../common/hooks/useReservations";

export function DoOnStateChange(
  reservationId: string,
  newState: ReservationState,
  guestInboxUrl: string
): void {
  switch (newState) {
    case ReservationState.CANCELLED:
      ShowCustomSnackbar((key) => (
        <CancelProgressSnackbar key={key} reservationId={reservationId} />
      ));
      break;

    case ReservationState.ACTIVE:
      try {
        OnCheckIn(reservationId, guestInboxUrl);
      } catch (error) {
        ReportFailureToGuest(
          error.message,
          ReservationState.CONFIRMED,
          guestInboxUrl
        );
        return;
      }

      break;

    case ReservationState.PAST:
      try {
        OnCheckOut(reservationId, guestInboxUrl);
      } catch (error) {
        ReportFailureToGuest(
          error.message,
          ReservationState.ACTIVE,
          guestInboxUrl
        );
        return;
      }
      break;

    default:
      throw new Error(
        `Reservation state change ${newState.toString()} doesn't make sense on hotel side`
      );
  }

  SetReservationStateAndInbox(reservationId, newState, guestInboxUrl);
  RevalidateReservations();

  const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);
  ConfirmReservationStateRequest(newState, guestInboxUrl, hotelInboxUrl);
}

async function OnCheckIn(
  reservationId: string,
  replyInbox: string
): Promise<void> {
  const guestWebId = await GetOwnerFromReservation(reservationId);
  if (!guestWebId) {
    //TODO solve for offline checkin
    throw new Error(`Guest webID null in reservation ${reservationId}`);
  }

  ShowCustomSnackbar((key) => (
    <CheckinProgressSnackbar
      key={key}
      reservationId={reservationId}
      guestWebId={guestWebId}
      replyInbox={replyInbox}
    />
  ));
}

async function OnCheckOut(
  reservationId: string,
  replyInbox: string
): Promise<void> {
  const reservationOwner = await GetOwnerFromReservation(reservationId);
  if (!reservationOwner) {
    //TODO solve for offline checkin
    throw new Error(
      `Reservation owner is null in reservation ${reservationId}`
    );
  }

  ShowCustomSnackbar((key) => (
    <CheckoutProgressSnackbar
      key={key}
      reservationId={reservationId}
      reservationOwner={reservationOwner}
      replyInbox={replyInbox}
    />
  ));
}
