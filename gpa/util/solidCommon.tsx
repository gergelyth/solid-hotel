import {
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { SolidDataset } from "@inrupt/solid-client";

export function CreateReservationDataset(
  reservation: ReservationAtHotel
): SolidDataset {
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
  return reservationDataset;
}
