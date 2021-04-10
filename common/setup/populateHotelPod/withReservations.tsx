import { HotelWebId } from "../../consts/solidIdentifiers";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { AddReservationToHotelPod } from "../../util/solidhoteladmin";
import { GetCurrentDatePushedBy, GetSharedReservations } from "../shared";

function CreateReservations(): ReservationAtHotel[] {
  let id = 200;
  const reservations: ReservationAtHotel[] = [
    {
      id: `reservation${id++}`,
      ownerId: 1,
      hotel: HotelWebId,
      roomId: 2,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 0),
      dateTo: GetCurrentDatePushedBy(0, 1, 2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 5,
      hotel: HotelWebId,
      roomId: 2,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 22),
      dateTo: GetCurrentDatePushedBy(0, 2, 25),
    },
    {
      id: `reservation${id++}`,
      ownerId: 2,
      hotel: HotelWebId,
      roomId: 3,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 12),
      dateTo: GetCurrentDatePushedBy(0, 1, 17),
    },
    {
      id: `reservation${id++}`,
      ownerId: 4,
      hotel: HotelWebId,
      roomId: 5,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 5, 0),
      dateTo: GetCurrentDatePushedBy(0, 5, 7),
    },
    {
      id: `reservation${id++}`,
      ownerId: 1,
      hotel: HotelWebId,
      roomId: 1,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 5),
      dateTo: GetCurrentDatePushedBy(0, 2, 15),
    },
    {
      id: `reservation${id++}`,
      ownerId: 7,
      hotel: HotelWebId,
      roomId: 2,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, -3, -5),
      dateTo: GetCurrentDatePushedBy(0, -3, -2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 4,
      hotel: HotelWebId,
      roomId: 4,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -6),
      dateTo: GetCurrentDatePushedBy(0, 0, 4),
    },
    {
      id: `reservation${id++}`,
      ownerId: 5,
      hotel: HotelWebId,
      roomId: 3,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, -1, -5),
      dateTo: GetCurrentDatePushedBy(0, -1, -2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 6,
      hotel: HotelWebId,
      roomId: 1,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, 0, -15),
      dateTo: GetCurrentDatePushedBy(0, 0, -11),
    },
    {
      id: `reservation${id++}`,
      ownerId: 7,
      hotel: HotelWebId,
      roomId: 2,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-5, -1, 0),
      dateTo: GetCurrentDatePushedBy(-5, 0, -23),
    },
  ];

  return reservations;
}

export default function PopulateHotelPodWithReservations(
  userWebId: string
): void {
  const reservations = CreateReservations().concat(
    GetSharedReservations(userWebId)
  );
  reservations.forEach((reservation: ReservationAtHotel) =>
    AddReservationToHotelPod(reservation)
  );
  console.log("Hotel Pod populated with reservations.");
}
