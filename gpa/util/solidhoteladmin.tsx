import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  // getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  // SolidDataset,
} from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { RoomDefinition } from "../../common/types/RoomDefinition";
import { roomFieldToRdfMap } from "../../common/vocabularies/rdf_room";
import { CreateReservationDataset } from "../../common/util/solidCommon";
import {
  ReservationsUrl,
  RoomDefinitionsUrl,
} from "../../common/consts/solidIdentifiers";

// import { NotFoundError } from "./errors";

// type ReservationsDataSet = {
//   reservationsUrl: string;
//   dataSet: SolidDataset | null;
// };

function GetHotelSession(): Session {
  // TODO: temporarily, we should retrieve the hotel's session here
  return getDefaultSession();
}

// async function GetReservationDataSet(
//   session: Session = GetHotelSession()
// ): Promise<ReservationsDataSet> {
//   const reservationsUrl = hotelPod + reservationAddress;

//   const dataSet = await getSolidDataset(reservationsUrl, {
//     fetch: session.fetch,
//   });

//   // TODO: if not found, create
//   // saveDataSolidSet creates intermediary things if not found

//   return { dataSet, reservationsUrl };
// }

export async function AddReservationToHotelPod(
  reservation: ReservationAtHotel,
  // TODO: get Hotel session here
  session = GetHotelSession()
): Promise<void> {
  // const reservations = await GetReservationDataSet();

  // if (!reservations.dataSet) {
  //   throw new NotFoundError(
  //     `Reservations dataset not found at ${reservations.reservationsUrl}`
  //   );
  // }

  const reservationDataset = CreateReservationDataset(reservation);

  await saveSolidDatasetAt(
    ReservationsUrl + reservation.id,
    reservationDataset,
    {
      fetch: session.fetch,
    }
  );
}

export async function AddRoom(room: RoomDefinition): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();
  // const reservations = await GetReservationDataSet();

  // if (!reservations.dataSet) {
  //   throw new NotFoundError(
  //     `Reservations dataset not found at ${reservations.reservationsUrl}`
  //   );
  // }

  // TODO: make rooms folder public programatically
  let roomDataset = createSolidDataset();

  let newRoom = createThing({ name: "room" });
  newRoom = addStringNoLocale(newRoom, roomFieldToRdfMap.name, room.name);
  if (room.description) {
    newRoom = addStringNoLocale(
      newRoom,
      roomFieldToRdfMap.description,
      room.description
    );
  }

  roomDataset = setThing(roomDataset, newRoom);

  await saveSolidDatasetAt(RoomDefinitionsUrl + room.id, roomDataset, {
    fetch: session.fetch,
  });
}
