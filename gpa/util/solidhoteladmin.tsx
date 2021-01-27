import {
  addStringNoLocale,
  createThing,
  getSolidDataset,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { fieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";

type ReservationsDataSet = {
  reservationsUrl: string;
  dataSet: SolidDataset | null;
};

const hotelPod = "https://solidhotel.inrupt.net/";
const reservationAddress = "reservations/";
// const roomDefinitionAddress = "rooms/";

function GetHotelSession(): Session {
  // TODO: temporarily, we should retrieve the hotel's session here
  return getDefaultSession();
}

async function GetReservationDataSet(
  session: Session = GetHotelSession()
): Promise<ReservationsDataSet> {
  const reservationsUrl = hotelPod + reservationAddress;

  const dataSet = await getSolidDataset(reservationsUrl, {
    fetch: session.fetch,
  });

  return { dataSet, reservationsUrl };
}

export async function AddReservation(
  id: string,
  checkinTime: string,
  reservationFor: string
): Promise<void> {
  // TODO: get Hotel session here
  const session = GetHotelSession();
  const reservations = await GetReservationDataSet();

  if (!reservations.dataSet) {
    throw new NotFoundError(
      `Reservations dataset not found at ${reservations.reservationsUrl}`
    );
  }

  let newReservation = createThing({ name: id });
  newReservation = addStringNoLocale(
    newReservation,
    fieldToRdfMap.reservationFor,
    reservationFor
  );
  newReservation = addStringNoLocale(
    newReservation,
    fieldToRdfMap.checkinTime,
    checkinTime
  );
  const updatedDataSet = setThing(reservations.dataSet, newReservation);

  await saveSolidDatasetAt(reservations.reservationsUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}
