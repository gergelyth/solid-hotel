import { createContainerAt } from "@inrupt/solid-client";
import {
  BookingInboxUrl,
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { GetCurrentDatePushedBy } from "../../util/helpers";
import { GetSession } from "../../util/solid";
import { SetSubmitterAccessToEveryone } from "../../util/solid_access";
import { AddReservation } from "../../util/solid_reservations";
import { GetSharedReservations } from "../shared";
import { CreateRooms } from "./withRooms";

function CreateReservations(
  activeProfileIds: string[],
  dataProtectionProfileIds: string[]
): ReservationAtHotel[] {
  const owner1 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner2 = "https://owner2.fakeprovider.net/profile/card#me";
  const owner3 = "https://owner3.fakeprovider.net/profile/card#me";
  const owner4 = "https://owner4.fakeprovider.net/profile/card#me";
  const owner5 = "https://owner5.fakeprovider.net/profile/card#me";

  const rooms = CreateRooms();
  //TODO room IDs are null!

  const reservations: ReservationAtHotel[] = [
    {
      id: null,
      inbox: null,
      owner: owner1,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[1].id,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 0),
      dateTo: GetCurrentDatePushedBy(0, 1, 2),
    },
    {
      id: null,
      inbox: null,
      owner: owner5,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[1].id,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 22),
      dateTo: GetCurrentDatePushedBy(0, 2, 25),
    },
    {
      id: null,
      inbox: null,
      owner: owner2,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[2].id,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 1, 12),
      dateTo: GetCurrentDatePushedBy(0, 1, 17),
    },
    {
      id: null,
      inbox: null,
      owner: owner4,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[4].id,
      state: ReservationState.CONFIRMED,
      dateFrom: GetCurrentDatePushedBy(0, 5, 0),
      dateTo: GetCurrentDatePushedBy(0, 5, 7),
    },
    {
      id: null,
      inbox: null,
      owner: owner1,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[0].id,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, 2, 5),
      dateTo: GetCurrentDatePushedBy(0, 2, 15),
    },
    {
      id: null,
      inbox: null,
      owner: owner3,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[1].id,
      state: ReservationState.CANCELLED,
      dateFrom: GetCurrentDatePushedBy(0, -3, -5),
      dateTo: GetCurrentDatePushedBy(0, -3, -2),
    },
    {
      id: null,
      inbox: null,
      owner: activeProfileIds[0],
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[3].id,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -6),
      dateTo: GetCurrentDatePushedBy(0, 0, 4),
    },
    {
      id: null,
      inbox: null,
      owner: dataProtectionProfileIds[0],
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[2].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, -1, -5),
      dateTo: GetCurrentDatePushedBy(0, -1, -2),
    },
    {
      id: null,
      inbox: null,
      owner: dataProtectionProfileIds[1],
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[0].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, 0, -15),
      dateTo: GetCurrentDatePushedBy(0, 0, -11),
    },
    {
      id: null,
      inbox: null,
      owner: dataProtectionProfileIds[2],
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[1].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(-5, -1, 0),
      dateTo: GetCurrentDatePushedBy(-5, 0, -23),
    },
  ];

  return reservations;
}

export async function PopulateHotelPodWithReservations(
  sharedReservationWebId: string,
  activeProfileIds: string[],
  dataProtectionProfileIds: string[]
): Promise<void> {
  if (activeProfileIds.length != 2) {
    throw new Error("Fake data - active profile ID count does not equal 2!");
  }
  if (dataProtectionProfileIds.length != 4) {
    throw new Error(
      "Fake data - data protection profile ID count does not equal 4!"
    );
  }

  //the first ID is the shared guest's
  const [sharedActiveProfileWebId, ...otherActiveProfileIds] = activeProfileIds;
  const [sharedDataProtectionProfileWebId, ...otherDataProtectionProfileIds] =
    dataProtectionProfileIds;

  const reservations = CreateReservations(
    otherActiveProfileIds,
    otherDataProtectionProfileIds
  ).concat(
    GetSharedReservations(
      sharedReservationWebId,
      sharedActiveProfileWebId,
      sharedDataProtectionProfileWebId
    )
  );
  await Promise.all(
    reservations.map((reservation) => AddReservation(reservation))
  );
}

export async function CreateBookingInbox(): Promise<void> {
  const session = GetSession();
  await createContainerAt(BookingInboxUrl, { fetch: session.fetch });
  await SetSubmitterAccessToEveryone(BookingInboxUrl);
}
