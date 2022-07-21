import { ReservationState } from "../../common/types/ReservationState";
import {
  GetOwnerFromReservation,
  SetReservationStateAndInbox,
} from "../../common/util/solidReservations";
import {
  ConfirmReservationStateRequest,
  ReportFailureToGuest,
} from "./outgoingCommunications";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";
import { ShowCustomSnackbar } from "../../common/components/snackbar";
import { CheckinProgressSnackbar } from "../components/checkin/checkin-progress-snackbar";
import { CheckoutProgressSnackbar } from "../components/checkout/checkout-progress-snackbar";
import { CancelProgressSnackbar } from "../components/cancelation/cancel-progress-snackbar";
import { RevalidateReservations } from "../../common/hooks/useReservations";

/**
 * Performs the state specific action when the state of the reservation gets changed.
 * Updates the reservation state and reply inbox address in the Solid Pod.
 * Sends a notification to the guest that the reservation state was successfully updated.
 * The guest inbox URL may be undefined if we're e.g. cancelling an unpaired reservation - in this case we don't send any responses to this URL.
 */
export function DoOnStateChange(
  reservationId: string,
  newState: ReservationState,
  guestInboxUrl?: string
): void {
  switch (newState) {
    case ReservationState.CANCELLED:
      ShowCustomSnackbar((key) => (
        <CancelProgressSnackbar
          snackbarKey={key}
          reservationId={reservationId}
        />
      ));
      break;

    case ReservationState.ACTIVE:
      try {
        OnCheckIn(reservationId, guestInboxUrl);
      } catch (error: unknown) {
        if (guestInboxUrl) {
          ReportFailureToGuest(
            `${error}`,
            ReservationState.CONFIRMED,
            guestInboxUrl
          );
        }
        return;
      }

      break;

    case ReservationState.PAST:
      try {
        OnCheckOut(reservationId, guestInboxUrl);
      } catch (error: unknown) {
        if (guestInboxUrl) {
          ReportFailureToGuest(
            `${error}`,
            ReservationState.ACTIVE,
            guestInboxUrl
          );
        }
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

  if (guestInboxUrl) {
    const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);
    ConfirmReservationStateRequest(newState, guestInboxUrl, hotelInboxUrl);
  }
}

/**
 * Performs the check-in operation.
 * This is a function wrapper triggering the {@link CheckinProgressSnackbar} snackbar to execute the actions.
 */
async function OnCheckIn(
  reservationId: string,
  replyInbox?: string
): Promise<void> {
  const guestWebId = await GetOwnerFromReservation(reservationId);
  if (!guestWebId || !replyInbox) {
    throw new Error(
      "Required information is null/undefined when preparing for check-in. This method can't be used for offline check-in."
    );
  }

  ShowCustomSnackbar((key) => (
    <CheckinProgressSnackbar
      snackbarKey={key}
      reservationId={reservationId}
      guestWebId={guestWebId}
      replyInbox={replyInbox}
    />
  ));
}

/**
 * Performs the check-out operation.
 * This is a function wrapper triggering the {@link CheckoutProgressSnackbar} snackbar to execute the actions.
 */
async function OnCheckOut(
  reservationId: string,
  replyInbox?: string
): Promise<void> {
  const reservationOwner = await GetOwnerFromReservation(reservationId);
  //TODO we don't have an offline check-out
  if (!reservationOwner || !replyInbox) {
    throw new Error(
      "Required information is null/undefined when preparing for check-out. This method can't be used for offline check-in."
    );
  }

  ShowCustomSnackbar((key) => (
    <CheckoutProgressSnackbar
      snackbarKey={key}
      reservationId={reservationId}
      reservationOwner={reservationOwner}
      replyInbox={replyInbox}
    />
  ));
}
