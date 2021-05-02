import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import {
  CreateReservationDataset,
  CreateReservationRequestDataset,
} from "../../common/util/solidCommon";
import {
  BookingInboxUrl,
  CancellationsUrl,
  CheckinInboxUrl,
  CheckoutInboxUrl,
} from "../../common/consts/solidIdentifiers";
import { ReservationState } from "../../common/types/ReservationState";

export async function SubmitBookingRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  const reservationDataset = CreateReservationDataset(reservation);

  await saveSolidDatasetInContainer(BookingInboxUrl, reservationDataset, {
    fetch: session.fetch,
  });
}

async function SubmitReservationRequest(
  hotelInboxUrl: string,
  reservation: ReservationAtHotel,
  requestedState: ReservationState,
  session: Session
): Promise<void> {
  const request = {
    reservationId: reservation.id,
    ownerInboxUrl: reservation.inbox,
    requestedState: requestedState,
  };
  const requestDataset = CreateReservationRequestDataset(request);

  await saveSolidDatasetInContainer(hotelInboxUrl, requestDataset, {
    fetch: session.fetch,
  });
}

export async function SubmitCheckinRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  await SubmitReservationRequest(
    CheckinInboxUrl,
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
    CancellationsUrl,
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
    CheckoutInboxUrl,
    reservation,
    ReservationState.PAST,
    session
  );
}
