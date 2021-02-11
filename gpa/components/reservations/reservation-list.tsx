import styles from "../../styles/Home.module.css";
import {
  getDatetime,
  getInteger,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { GetItems } from "../common/fetchListThenItemsFromPod";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../util/solid";
import { reservationFieldToRdfMap } from "../../vocabularies/rdf_reservation";
import { ReservationState } from "../../types/ReservationState";

function ConvertToReservation(
  dataset: SolidDataset,
  url: string
): ReservationAtHotel | null {
  const reservationId = url.split("/").pop();
  if (!reservationId) {
    return null;
  }
  const reservationThing = getThing(dataset, url + "#reservation");
  if (!reservationThing) {
    return null;
  }
  // TODO: modify No Id and No Name
  const reservation = {
    id: reservationId,
    ownerId:
      getInteger(reservationThing, reservationFieldToRdfMap.owner) ?? 9999999,
    roomId:
      getInteger(reservationThing, reservationFieldToRdfMap.room) ?? 9999999,
    state: getInteger(reservationThing, reservationFieldToRdfMap.state) ?? 0,
    dateFrom:
      getDatetime(reservationThing, reservationFieldToRdfMap.checkinTime) ??
      // TODO: change default value here
      new Date(),
    dateTo:
      getDatetime(reservationThing, reservationFieldToRdfMap.checkoutTime) ??
      // TODO: change default value here
      new Date(),
  };

  return reservation;
}

function CreateReservationElement(
  reservation: ReservationAtHotel | null
): JSX.Element {
  if (!reservation) {
    return <li>empty</li>;
  }
  return (
    <li key={reservation.id}>
      <h3>Owner: {reservation.ownerId}</h3>
      <div>Room: {reservation.roomId}</div>
      <div>State: {ReservationState[reservation.state]}</div>
      <div>Check-in date: {reservation.dateFrom.toDateString()}</div>
      <div>Check-out date: {reservation.dateTo.toDateString()}</div>
    </li>
  );
}

function ReservationList(): JSX.Element {
  const reservationsUrl = GetUserReservationsPodUrl();
  return (
    <div>
      <h1 className={styles.title}>Your reservations (from user Pod)</h1>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      {GetItems<ReservationAtHotel>(
        "reservations",
        reservationsUrl,
        CreateReservationElement,
        ConvertToReservation
      )}
    </div>
  );
}

export default ReservationList;
