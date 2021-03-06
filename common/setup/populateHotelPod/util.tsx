import {
  BookingInboxUrl,
  DataProtectionProfilesUrl,
  HotelProfilesUrl,
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { RecursiveDelete } from "../shared";

export async function DeleteAllHotelReservations(): Promise<void> {
  await Promise.all([
    RecursiveDelete(ReservationsUrl),
    RecursiveDelete(BookingInboxUrl),
  ]);
}

export async function DeleteAllHotelRooms(): Promise<void> {
  await RecursiveDelete(RoomDefinitionsUrl);
}

export async function DeleteAllProfiles(): Promise<void> {
  await Promise.all([
    RecursiveDelete(HotelProfilesUrl),
    RecursiveDelete(DataProtectionProfilesUrl),
  ]);
}
