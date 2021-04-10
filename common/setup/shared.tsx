import { HotelWebId } from "../consts/solidIdentifiers";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";

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

export function GetSharedReservations(userWebId: string): ReservationAtHotel[] {
  let id = 400;
  const sharedReservations: ReservationAtHotel[] = [
    {
      id: `reservation${id++}`,
      ownerId: 3,
      hotel: HotelWebId,
      roomId: 4,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 0, -3),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: `reservation${id++}`,
      ownerId: 3,
      hotel: HotelWebId,
      roomId: 1,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -2),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: `reservation${id++}`,
      ownerId: 3,
      hotel: HotelWebId,
      roomId: 4,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -15),
    },
  ];

  return sharedReservations;
}
