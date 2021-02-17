import { ReservationAtHotel } from "../types/ReservationAtHotel";
import {
  getDatetime,
  getInteger,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { GetUserReservationsPodUrl } from "../util/solid";
import { FetchItems } from "./util/listThenItemsFetcher";

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

export function useUserReservations(): {
  items: (ReservationAtHotel | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const reservationsUrl = GetUserReservationsPodUrl();
  if (!reservationsUrl) {
    return { items: undefined, isLoading: false, isError: true };
  }

  return FetchItems<ReservationAtHotel>(
    "reservations",
    reservationsUrl,
    ConvertToReservation
  );
}
