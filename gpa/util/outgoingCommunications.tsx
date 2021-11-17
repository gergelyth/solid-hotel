import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { BookingInboxUrl } from "../../common/consts/solidIdentifiers";
import { ReservationState } from "../../common/types/ReservationState";
import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { SerializeBookingRequest } from "../../common/notifications/BookingRequest";
import { SerializeInitialPairingRequest } from "../../common/notifications/InitialPairingRequest";
import { SerializePrivacyInformationDeletion } from "../../common/notifications/PrivacyInformationDeletion";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { GetSession } from "../../common/util/solid";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";

export async function SubmitBookingRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  const notificationDataset = SerializeBookingRequest(reservation);

  await saveSolidDatasetInContainer(BookingInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

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

export async function SubmitPrivacyTokenDeletionRequest(
  privacyToken: PrivacyToken,
  session = GetSession()
): Promise<void> {
  if (!privacyToken.url) {
    throw new Error(
      "Token URL was annulled outside of the application. Cannot delete"
    );
  }

  const notificationDataset = SerializePrivacyInformationDeletion(
    privacyToken.url
  );

  await saveSolidDatasetInContainer(
    privacyToken.hotelInboxForDeletion,
    notificationDataset,
    {
      fetch: session.fetch,
    }
  );
}
