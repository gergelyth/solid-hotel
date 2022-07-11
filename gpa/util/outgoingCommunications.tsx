import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { BookingInboxUrl } from "../../common/consts/solidIdentifiers";
import { ReservationState } from "../../common/types/ReservationState";
import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { SerializeBookingRequest } from "../../common/notifications/BookingRequest";
import { SerializeInitialPairingRequest } from "../../common/notifications/InitialPairingRequest";
import { SerializePrivacyInformationDeletion } from "../../common/notifications/PrivacyInformationDeletion";
import { GetSession } from "../../common/util/solid";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";
import { ProfileUpdate } from "../../common/util/tracker/trackerSendChange";
import { SerializeProfileModification } from "../../common/notifications/ProfileModification";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";

/**
 * Creates the booking request dataset and submits it into the hotel's booking requests inbox.
 */
export async function SubmitBookingRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  const notificationDataset = SerializeBookingRequest(reservation);

  await saveSolidDatasetInContainer(BookingInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

/**
 * A common function to create the reservation state change request dataset and submit it into the hotel's reservation inbox.
 */
async function SubmitReservationStateChangeRequest(
  hotelInboxUrl: string | null,
  reservation: ReservationAtHotel,
  requestedState: ReservationState,
  session: Session
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

  await saveSolidDatasetInContainer(hotelInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

/**
 * Creates the check-in request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCheckinRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.ACTIVE,
    session
  );
}

/**
 * Creates the cancellation request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCancellationRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.CANCELLED,
    session
  );
}

/**
 * Creates the check-out request dataset and submits it into the hotel's reservation inbox.
 */
export async function SubmitCheckoutRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  await SubmitReservationStateChangeRequest(
    reservation.inbox,
    reservation,
    ReservationState.PAST,
    session
  );
}

/**
 * Creates the pairing request dataset and submits it into the hotel's reservation inbox which we got as a query parameter of the pairing/ page.
 */
export async function SubmitInitialPairingRequest(
  guestInboxUrl: Promise<string>,
  pairingToken: string,
  hotelInboxUrl: string,
  session = getDefaultSession()
): Promise<void> {
  const notificationDataset = SerializeInitialPairingRequest(
    await guestInboxUrl,
    pairingToken
  );

  await saveSolidDatasetInContainer(hotelInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

/**
 * Creates the privacy token deletion request dataset and submits it into the hotel's specific inbox created for these requests.
 */
export async function SubmitPrivacyTokenDeletionRequest(
  privacyToken: GuestPrivacyToken,
  guestInboxUrl?: string,
  session = GetSession()
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

  await saveSolidDatasetInContainer(
    privacyToken.hotelInboxForDeletion,
    notificationDataset,
    {
      fetch: session.fetch,
    }
  );
}

/**
 * Creates the profile modifiation notice dataset and submits it into the hotel's reservation inbox.
 */
export async function SendProfileModification(
  approvedFields: ProfileUpdate,
  hotelInboxUrl: string,
  session: Session = GetSession()
): Promise<void> {
  const profileModification = SerializeProfileModification(approvedFields);

  await saveSolidDatasetInContainer(hotelInboxUrl, profileModification, {
    fetch: session.fetch,
  });
}
