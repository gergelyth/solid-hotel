import { createContainerAt } from "@inrupt/solid-client";
import {
  BookingInboxUrl,
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { GetSession } from "../../util/solid";
import { SetSubmitterAccessToEveryone } from "../../util/solid_access";
import { AddReservation } from "../../util/solid_reservations";
import { GetCurrentDatePushedBy, GetSharedReservations } from "../shared";
import { CreateRooms } from "./withRooms";

function CreateReservations(): ReservationAtHotel[] {
  //TODO populate the hotel profiles and data protection information according to data.sql
  //TODO adjust these according to the fake data created in data.sql
  //TODO ownerIDs were adjusted = id 3 was extracted to shared, id 7 renamed to 3
  const owner1 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner2 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner3 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner4 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner5 = "https://owner1.fakeprovider.net/profile/card#me";
  const owner6 = "https://owner1.fakeprovider.net/profile/card#me";

  const rooms = CreateRooms();

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
      owner: owner4,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[3].id,
      state: ReservationState.ACTIVE,
      dateFrom: GetCurrentDatePushedBy(0, 0, -6),
      dateTo: GetCurrentDatePushedBy(0, 0, 4),
    },
    {
      id: null,
      inbox: null,
      owner: owner5,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[2].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, -1, -5),
      dateTo: GetCurrentDatePushedBy(0, -1, -2),
    },
    {
      id: null,
      inbox: null,
      owner: owner6,
      hotel: HotelWebId,
      room: RoomDefinitionsUrl + rooms[0].id,
      state: ReservationState.PAST,
      dateFrom: GetCurrentDatePushedBy(0, 0, -15),
      dateTo: GetCurrentDatePushedBy(0, 0, -11),
    },
    {
      id: null,
      inbox: null,
      owner: owner3,
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
  userWebId: string
): Promise<void> {
  const reservations = CreateReservations().concat(
    GetSharedReservations(userWebId)
  );
  await Promise.all(
    reservations.map((reservation) => AddReservation(reservation))
  );
}

export async function CreateBookingInbox(): Promise<void> {
  const session = GetSession();
  await Promise.all([
    createContainerAt(BookingInboxUrl, { fetch: session.fetch }),
    SetSubmitterAccessToEveryone(BookingInboxUrl),
  ]);
}
