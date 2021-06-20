import {
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../consts/solidIdentifiers";
import { RecursiveDelete } from "../shared";

export async function DeleteAllHotelReservations(): Promise<void> {
  RecursiveDelete(ReservationsUrl);
}

export async function DeleteAllHotelRooms(): Promise<void> {
  RecursiveDelete(RoomDefinitionsUrl);
}
