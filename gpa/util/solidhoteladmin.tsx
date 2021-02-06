import {
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  // getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  // SolidDataset,
} from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { RoomDefinition } from "../types/RoomDefinition";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { roomFieldToRdfMap } from "../vocabularies/rdf_room";
// import { NotFoundError } from "./errors";

// type ReservationsDataSet = {
//   reservationsUrl: string;
//   dataSet: SolidDataset | null;
// };

const hotelPod = "https://solidhotel.inrupt.net/";
const reservationAddress = "reservations/";
const roomDefinitionAddress = "rooms/";

const reservationsUrl = hotelPod + reservationAddress;
const roomDefinitionsUrl = hotelPod + roomDefinitionAddress;

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

export async function AddReservation(
  reservation: ReservationAtHotel
): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();
  // const reservations = await GetReservationDataSet();

  // if (!reservations.dataSet) {
  //   throw new NotFoundError(
  //     `Reservations dataset not found at ${reservations.reservationsUrl}`
  //   );
  // }

  let reservationDataset = createSolidDataset();

  let newReservation = createThing({ name: "reservation" });
  newReservation = addInteger(
    newReservation,
    // TODO: this should be an URL pointing to the ROOM definition
    reservationFieldToRdfMap.room,
    reservation.roomId
  );
  newReservation = addInteger(
    newReservation,
    // TODO: should this be an URL pointing to the WebID?
    reservationFieldToRdfMap.owner,
    reservation.ownerId
  );
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.state,
    reservation.state.toString()
  );
  newReservation = addDatetime(
    newReservation,
    reservationFieldToRdfMap.checkinTime,
    reservation.dateFrom
  );
  newReservation = addDatetime(
    newReservation,
    reservationFieldToRdfMap.checkoutTime,
    reservation.dateTo
  );

  reservationDataset = setThing(reservationDataset, newReservation);

  await saveSolidDatasetAt(
    reservationsUrl + reservation.id,
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

  await saveSolidDatasetAt(roomDefinitionsUrl + room.id, roomDataset, {
    fetch: session.fetch,
  });
}
