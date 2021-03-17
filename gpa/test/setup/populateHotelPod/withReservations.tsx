import { ReservationAtHotel } from "../../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../../common/types/ReservationState";
import { AddReservationToHotelPod } from "../../../../common/util/solidhoteladmin";

export function GetCurrentDatePushedBy(
  yearOffset: number,
  monthOffset: number,
  dayOffset: number
): Date {
  const date = new Date();
  const year = date.getFullYear() + yearOffset;
  const month = date.getMonth() + monthOffset;
  const day = date.getDate() + dayOffset;

  date.setFullYear(year, month, day);
  return date;
}

function CreateReservations(): ReservationAtHotel[] {
  let id = 0;
  const reservations: ReservationAtHotel[] = [
    {
      id: `reservation${id++}`,
      ownerId: 1,
      roomId: 2,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 0),
      dateTo: GetCurrentDatePushedBy(0, 1, 2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 5,
      roomId: 2,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 22),
      dateTo: GetCurrentDatePushedBy(0, 2, 25),
    },
    {
      id: `reservation${id++}`,
      ownerId: 2,
      roomId: 3,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 12),
      dateTo: GetCurrentDatePushedBy(0, 1, 17),
    },
    {
      id: `reservation${id++}`,
      ownerId: 4,
      roomId: 5,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 5, 0),
      dateTo: GetCurrentDatePushedBy(0, 5, 7),
    },
    {
      id: `reservation${id++}`,
      ownerId: 1,
      roomId: 1,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 5),
      dateTo: GetCurrentDatePushedBy(0, 2, 15),
    },
    {
      id: `reservation${id++}`,
      ownerId: 3,
      roomId: 4,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 0, -3),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: `reservation${id++}`,
      ownerId: 7,
      roomId: 2,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, -3, -5),
      dateTo: GetCurrentDatePushedBy(0, -3, -2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 3,
      roomId: 1,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -2),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: `reservation${id++}`,
      ownerId: 4,
      roomId: 4,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -6),
      dateTo: GetCurrentDatePushedBy(0, 0, 4),
    },
    {
      id: `reservation${id++}`,
      ownerId: 5,
      roomId: 3,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, -1, -5),
      dateTo: GetCurrentDatePushedBy(0, -1, -2),
    },
    {
      id: `reservation${id++}`,
      ownerId: 6,
      roomId: 1,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, 0, -15),
      dateTo: GetCurrentDatePushedBy(0, 0, -11),
    },
    {
      id: `reservation${id++}`,
      ownerId: 3,
      roomId: 4,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -15),
    },
    {
      id: `reservation${id++}`,
      ownerId: 7,
      roomId: 2,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-5, -1, 0),
      dateTo: GetCurrentDatePushedBy(-5, 0, -23),
    },
  ];

  return reservations;
}

export default function PopulateHotelPodWithReservations(): void {
  const reservations = CreateReservations();
  reservations.forEach((reservation: ReservationAtHotel) =>
    AddReservationToHotelPod(reservation)
  );
  console.log("Hotel Pod populated with reservations.");
}
