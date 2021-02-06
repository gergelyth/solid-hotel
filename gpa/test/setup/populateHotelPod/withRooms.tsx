import { RoomDefinition } from "../../../types/RoomDefinition";
import { AddRoom } from "../../../util/solidhoteladmin";

function CreateRooms(): RoomDefinition[] {
  let id = 0;
  const rooms: RoomDefinition[] = [
    {
      id: `room${id++}`,
      name: "5A",
      description: "Queen-sized bed, ocean-view.",
    },
    {
      id: `room${id++}`,
      name: "78Q",
      description:
        "Twin bed, equipped with a flat screen TV with international TV channels.",
    },
    {
      id: `room${id++}`,
      name: "209U",
      description:
        "King-sized bed, spacious wardrobe. Own bathrooms with a bathtub.",
    },
    {
      id: `room${id++}`,
      name: "9R",
      description:
        "Equipped with a shower, balcony overlooking the gardens. Room is air-conditioned.",
    },
    {
      id: `room${id++}`,
      name: "23A",
    },
  ];

  return rooms;
}

export default function PopulateHotelPodWithRooms(): void {
  const rooms = CreateRooms();
  rooms.forEach((room: RoomDefinition) => AddRoom(room));
  console.log("Hotel Pod populated with rooms.");
}
