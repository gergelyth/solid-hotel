import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { GetCurrentDatePushedBy } from "../../util/helpers";
import { AddReservation } from "../../util/solid_reservations";
import { GetSharedReservations } from "../shared";

function CreateReservations(userWebId: string): ReservationAtHotel[] {
  const otherHotelWebId =
    "https://someotherhotel.fakeprovider.net/profile/card#me";
  const room = "https://someotherhotel.fakeprovider.net/rooms/room1";

  const reservations: ReservationAtHotel[] = [
    {
      id: null,
      inbox:
        "https://someotherhotel.fakeprovider.net/reservations/293801934/inbox/",
      owner: userWebId,
      hotel: otherHotelWebId,
      room: room,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 0),
      dateTo: GetCurrentDatePushedBy(0, 1, 2),
    },
    {
      id: null,
      inbox:
        "https://someotherhotel.fakeprovider.net/reservations/103u40109231/inbox/",
      owner: userWebId,
      hotel: otherHotelWebId,
      room: room,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -27),
    },
  ];

  return reservations;
}

export default async function PopulateUserPodWithReservations(
  userWebId: string
): Promise<void> {
  const reservations = CreateReservations(userWebId).concat(
    GetSharedReservations(userWebId, userWebId, userWebId)
  );
  await Promise.all(
    reservations.map((reservation) => AddReservation(reservation))
  );
}
