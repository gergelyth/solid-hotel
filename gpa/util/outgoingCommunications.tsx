import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { BookingInboxUrl } from "../../common/consts/solidIdentifiers";
import { ReservationState } from "../../common/types/ReservationState";
import { SerializeReservationStateChange } from "../../common/notifications/reservationStateChange";
import { SerializeBookingRequest } from "../../common/notifications/bookingRequest";
import { SerializeInitialPairingRequest } from "../../common/notifications/initialPairingRequest";
import { SerializePrivacyInformationDeletion } from "../../common/notifications/privacyInformationDeletion";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";
import { ProfileUpdate } from "../../common/components/profilesync/tracker-send-change";
import { SerializeProfileModification } from "../../common/notifications/profileModification";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { SafeSaveDatasetInContainer } from "../../common/util/solidWrapper";

/**
 * Creates the booking request dataset and submits it into the hotel's booking requests inbox.
 */
export async function SubmitBookingRequest(
  reservation: ReservationAtHotel
): Promise<void> {
  const notificationDataset = SerializeBookingRequest(reservation);

  await SafeSaveDatasetInContainer(BookingInboxUrl, notificationDataset);
}

/**
 * A common function to create the reservation state change request dataset and submit it into the hotel's reservation inbox.
 */
async function SubmitReservationStateChangeRequest(
  hotelInboxUrl: string | null,
  reservation: ReservationAtHotel,
  requestedState: ReservationState
): Promise<void> {
  if (!hotelInboxUrl) {
    //TODO this can happen when the hotel has not confirmed the reservation yet and we try to cancel
    throw new Error(
      "Hotel inbox null when trying to submit hotel request change"
    );
  }

  if (!reservation.id) {
    throw new Error("Reservation id null");
  }

  const replyInbox = CreateInboxUrlFromReservationId(reservation.id);

  const notificationDataset = SerializeReservationStateChange(
    replyInbox,
    requestedState
  );

  await SafeSaveDatasetInContainer(hotelInboxUrl, notificationDataset);
}

/**
 * Creates the check-in request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCheckinRequest(
  reservation: ReservationAtHotel
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.ACTIVE
  );
}

/**
 * Creates the cancellation request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCancellationRequest(
  reservation: ReservationAtHotel
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.CANCELLED
  );
}

/**
 * Creates the check-out request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCheckoutRequest(
  reservation: ReservationAtHotel
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.PAST
  );
}

/**
 * Creates the pairing request dataset and submits it into the hotel's reservation inbox which we got as a query parameter of the pairing/ page.
 */
export async function SubmitInitialPairingRequest(
  guestInboxUrl: Promise<string>,
  pairingToken: string,
  hotelInboxUrl: string
): Promise<void> {
  const notificationDataset = SerializeInitialPairingRequest(
    await guestInboxUrl,
    pairingToken
  );

  await SafeSaveDatasetInContainer(hotelInboxUrl, notificationDataset);
}

/**
 * Creates the privacy token deletion request dataset and submits it into the hotel's specific inbox created for these requests.
 */
export async function SubmitPrivacyTokenDeletionRequest(
  privacyToken: GuestPrivacyToken,
  guestInboxUrl?: string
): Promise<void> {
  if (!privacyToken.urlAtHotel) {
    throw new Error(
      "Token URL was annulled outside of the application. Cannot delete"
    );
  }

  const notificationDataset = SerializePrivacyInformationDeletion(
    privacyToken.urlAtHotel,
    guestInboxUrl
  );

  await SafeSaveDatasetInContainer(
    privacyToken.hotelInboxForDeletion,
    notificationDataset
  );
}

/**
 * Creates the profile modifiation notice dataset and submits it into the hotel's reservation inbox.
 */
export async function SendProfileModification(
  approvedFields: ProfileUpdate,
  hotelInboxUrl: string
): Promise<void> {
  const profileModification = SerializeProfileModification(approvedFields);

  await SafeSaveDatasetInContainer(hotelInboxUrl, profileModification);
}
