import { getContainedResourceUrlAll } from "@inrupt/solid-client";
import { HotelWebId, RoomDefinitionsUrl } from "../consts/solidIdentifiers";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { GetReservationInboxFromWebId } from "../util/solid_reservations";
import { SafeDeleteDataset, SafeGetDataset } from "../util/solid_wrapper";
import { CreateRooms } from "./populateHotelPod/withRooms";

export async function RecursiveDelete(url: string): Promise<void> {
  const dataSet = await SafeGetDataset(url);
  if (!dataSet) {
    return;
  }

  //in case it's a container
  const urls = getContainedResourceUrlAll(dataSet);
  await Promise.all(urls.map((url) => RecursiveDelete(url)));

  await SafeDeleteDataset(url);
}

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
  const rooms = CreateRooms();

  const reservationInboxUrl = GetReservationInboxFromWebId(userWebId);
  const sharedReservations: ReservationAtHotel[] = [
    {
      id: null,
      inbox: reservationInboxUrl,
      owner: userWebId,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[3].id,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 0, -3),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: null,
      inbox: reservationInboxUrl,
      owner: userWebId,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[0].id,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -2),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: null,
      inbox: reservationInboxUrl,
      owner: userWebId,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[3].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -15),
    },
  ];

  return sharedReservations;
}
