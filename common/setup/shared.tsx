import {
  deleteSolidDataset,
  getContainedResourceUrlAll,
  getSolidDataset,
  isContainer,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { HotelWebId, RoomDefinitionsUrl } from "../consts/solidIdentifiers";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { GetSession } from "../util/solid";
import { GetReservationInboxFromWebId } from "../util/solid_reservations";
import { CreateRooms } from "./populateHotelPod/withRooms";

export async function RecursiveDelete(
  url: string,
  session: Session = GetSession()
): Promise<void> {
  const dataSet = await getSolidDataset(url, {
    fetch: session.fetch,
  });
  const urls = getContainedResourceUrlAll(dataSet);
  urls.forEach(async (itemUrl) => {
    if (isContainer(itemUrl)) {
      RecursiveDelete(itemUrl);
    }
  });

  await deleteSolidDataset(url, { fetch: session.fetch });
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
