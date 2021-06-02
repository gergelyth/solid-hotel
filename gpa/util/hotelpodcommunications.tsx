import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import {
  AddNotificationThingToDataset,
  CreateReservationDataset,
  CreateReservationRequestDataset,
} from "../../common/util/solidCommon";
import { BookingInboxUrl } from "../../common/consts/solidIdentifiers";
import { ReservationState } from "../../common/types/ReservationState";
import { NotificationType } from "../../common/types/NotificationsType";

export async function SubmitBookingRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  const reservationDataset = CreateReservationDataset(reservation);
  const notificationDataset = AddNotificationThingToDataset(
    reservationDataset,
    NotificationType.BookingRequest
  );

  await saveSolidDatasetInContainer(BookingInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

async function SubmitReservationRequest(
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
  const request = {
    reservationId: reservation.id,
    ownerInboxUrl: reservation.inbox,
    requestedState: requestedState,
  };
  const requestDataset = CreateReservationRequestDataset(request);
  const notificationDataset = AddNotificationThingToDataset(
    requestDataset,
    NotificationType.ReservationStateChange
  );

  await saveSolidDatasetInContainer(hotelInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

export async function SubmitCheckinRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  await SubmitReservationRequest(
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
  await SubmitReservationRequest(
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
  await SubmitReservationRequest(
    reservation.inbox,
    reservation,
    ReservationState.PAST,
    session
  );
}
