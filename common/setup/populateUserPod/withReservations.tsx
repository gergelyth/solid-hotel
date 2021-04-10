import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { AddReservation } from "../../util/solid";
import { GetCurrentDatePushedBy, GetSharedReservations } from "../shared";

function CreateReservations(userWebId: string): ReservationAtHotel[] {
  const otherHotelWebId =
    "https://someotherhotel.fakeprovider.net/profile/card#me";

  let id = 300;
  const reservations: ReservationAtHotel[] = [
    {
      id: `reservation${id++}`,
      ownerId: 1,
      hotel: otherHotelWebId,
      roomId: 2,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 0),
      dateTo: GetCurrentDatePushedBy(0, 1, 2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 5,
      hotel: otherHotelWebId,
      roomId: 2,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -27),
    },
  ];

  return reservations;
}

export default function PopulateUserPodWithReservations(
  userWebId: string
): void {
  const reservations = CreateReservations(userWebId).concat(
    GetSharedReservations(userWebId)
  );
  reservations.forEach((reservation: ReservationAtHotel) =>
    AddReservation(reservation)
  );
  console.log("User Pod populated with reservations.");
}