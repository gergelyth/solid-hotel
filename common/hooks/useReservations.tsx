import { ReservationAtHotel } from "../types/ReservationAtHotel";
import {
  getDatetime,
  getInteger,
  getStringNoLocale,
  getThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { FetchItems } from "./util/listThenItemsFetcher";
import { GetIdFromDatasetUrl } from "../util/urlParser";

export function ParseReservation(
  reservationThing: Thing,
  datasetUrl: string
): ReservationAtHotel {
  // TODO: modify No Id and No Name
  const reservation = {
    id: GetIdFromDatasetUrl(datasetUrl, 1),
    inbox: getStringNoLocale(reservationThing, reservationFieldToRdfMap.inbox),
    owner:
      getStringNoLocale(reservationThing, reservationFieldToRdfMap.owner) ??
      "<No owner ID>",
    hotel:
      getStringNoLocale(reservationThing, reservationFieldToRdfMap.hotel) ??
      "<No hotel WebId>",
    room:
      getStringNoLocale(reservationThing, reservationFieldToRdfMap.room) ??
      "<No room ID>",
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

function ConvertToReservation(
  dataset: SolidDataset,
  url: string
): ReservationAtHotel | null {
  const reservationThing = getThing(dataset, url + "#reservation");
  if (!reservationThing) {
    return null;
  }

  return ParseReservation(reservationThing, url);
}

export function useReservations(reservationsUrl: string | null): {
  items: (ReservationAtHotel | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  if (!reservationsUrl) {
    return { items: undefined, isLoading: false, isError: true };
  }

  return FetchItems<ReservationAtHotel>(
    "reservations",
    reservationsUrl,
    ConvertToReservation,
    (itemUrl) => {
      return itemUrl + "reservation";
    }
  );
}
