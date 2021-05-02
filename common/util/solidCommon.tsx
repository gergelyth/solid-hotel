import {
  addDatetime,
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { SolidDataset } from "@inrupt/solid-client";
import { ReservationRequest } from "../types/ReservationRequest";

export function CreateReservationDataset(
  reservation: ReservationAtHotel
): SolidDataset {
  let reservationDataset = createSolidDataset();

  let newReservation = createThing({ name: "reservation" });
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.room,
    reservation.room
  );
  newReservation = reservation.inbox
    ? addStringNoLocale(
        newReservation,
        reservationFieldToRdfMap.inbox,
        reservation.inbox
      )
    : newReservation;
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.hotel,
    reservation.hotel
  );
  newReservation = addStringNoLocale(
    newReservation,
    reservationFieldToRdfMap.owner,
    reservation.owner
  );
  newReservation = addInteger(
    newReservation,
    reservationFieldToRdfMap.state,
    reservation.state.valueOf()
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

export function CreateReservationRequestDataset(
  reservationRequest: ReservationRequest
): SolidDataset {
  let requestDataset = createSolidDataset();

  let request = createThing({ name: "reservationRequest" });
  request = addStringNoLocale(
    request,
    reservationFieldToRdfMap.id,
    reservationRequest.reservationId
  );
  request = addStringNoLocale(
    request,
    reservationFieldToRdfMap.inbox,
    reservationRequest.ownerInboxUrl ?? ""
  );
  request = addInteger(
    request,
    reservationFieldToRdfMap.state,
    reservationRequest.requestedState.valueOf()
  );

  requestDataset = setThing(requestDataset, request);
  return requestDataset;
}
