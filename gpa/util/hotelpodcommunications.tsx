import { saveSolidDatasetAt } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { CreateReservationDataset } from "../../common/util/solidCommon";
import { BookingInboxUrl } from "../../common/consts/solidIdentifiers";

export async function SubmitBookingRequest(
  reservation: ReservationAtHotel,
  session = getDefaultSession()
): Promise<void> {
  const reservationDataset = CreateReservationDataset(reservation);

  await saveSolidDatasetAt(
    BookingInboxUrl + reservation.id,
    reservationDataset,
    {
      fetch: session.fetch,
    }
  );
}
