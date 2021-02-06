import {
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { fieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";

type ReservationsDataSet = {
  reservationsUrl: string;
  dataSet: SolidDataset | null;
};

const hotelPod = "https://solidhotel.inrupt.net/";
const reservationAddress = "reservations/";
// const roomDefinitionAddress = "rooms/";
const reservationsUrl = hotelPod + reservationAddress;

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
    fieldToRdfMap.room,
    reservation.roomId
  );
  newReservation = addInteger(
    newReservation,
    // TODO: should this be an URL pointing to the WebID?
    fieldToRdfMap.owner,
    reservation.ownerId
  );
  newReservation = addStringNoLocale(
    newReservation,
    fieldToRdfMap.state,
    reservation.state.toString()
  );
  newReservation = addDatetime(
    newReservation,
    fieldToRdfMap.checkinTime,
    reservation.dateFrom
  );
  newReservation = addDatetime(
    newReservation,
    fieldToRdfMap.checkoutTime,
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
