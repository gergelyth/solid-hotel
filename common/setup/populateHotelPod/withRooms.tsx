import { RoomDefinition } from "../../types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../pms/util/solidHotelSpecific";

export function CreateRooms(): RoomDefinition[] {
  const rooms: RoomDefinition[] = [
    {
      id: null,
      name: "5A",
      description: "Queen-sized bed, ocean-view.",
    },
    {
      id: null,
      name: "78Q",
      description:
        "Twin bed, equipped with a flat screen TV with international TV channels.",
    },
    {
      id: null,
      name: "209U",
      description:
        "King-sized bed, spacious wardrobe. Own bathrooms with a bathtub.",
    },
    {
      id: null,
      name: "9R",
      description:
        "Equipped with a shower, balcony overlooking the gardens. Room is air-conditioned.",
    },
    {
      id: null,
      name: "23A",
    },
  ];

  return rooms;
}

export default function PopulateHotelPodWithRooms(): void {
  const rooms = CreateRooms();
  rooms.forEach((room: RoomDefinition) => CreateOrUpdateRoom(room));
  console.log("Hotel Pod populated with rooms.");
}
