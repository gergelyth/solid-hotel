import {
  createContainerAt,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";
import { HotelWebId, RoomDefinitionsUrl } from "../consts/solidIdentifiers";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { GetCurrentDatePushedBy } from "../util/helpers";
import { GetSession } from "../util/solid";
import { SetSubmitterAccessToEveryone } from "../util/solid_access";
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

export async function CreatePrivacyFolders(
  privacyUrl: string,
  privacyInboxUrl?: string
): Promise<void> {
  const session = GetSession();
  await createContainerAt(privacyUrl, { fetch: session.fetch });
  if (privacyInboxUrl) {
    await createContainerAt(privacyInboxUrl, { fetch: session.fetch });
    await SetSubmitterAccessToEveryone(privacyInboxUrl);
  }
}

export function GetSharedReservations(
  userWebId: string,
  activeProfileWebId: string,
  dataProtectionProfileWebId: string
): ReservationAtHotel[] {
  const rooms = CreateRooms();

  //TODO we need guestInbox for hotel, hotelInbox for guest
  const reservationInboxUrl = "TODO";
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
      owner: activeProfileWebId,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[0].id,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -2),
      dateTo: GetCurrentDatePushedBy(0, 0, 3),
    },
    {
      id: null,
      inbox: reservationInboxUrl,
      owner: dataProtectionProfileWebId,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[3].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-3, -1, 0),
      dateTo: GetCurrentDatePushedBy(-3, 0, -15),
    },
  ];

  return sharedReservations;
}
