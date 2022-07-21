import { ReservationAtHotel } from "../types/ReservationAtHotel";
import {
  getDatetime,
  getStringNoLocale,
  getUrl,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { ReservationFieldToRdfMap } from "../vocabularies/rdfReservation";
import { FetchItems } from "./util/listThenItemsFetcher";
import { GetIdFromDatasetUrl } from "../util/urlParser";
import { mutate } from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { GetThing } from "../util/solid";
import { ReverseReservationStateRdfMap } from "../vocabularies/rdfReservationStatusTypes";
import { ReservationState } from "../types/ReservationState";

const swrKey = "reservations";

/**
 * Parses the reservation from the {@link Thing}.
 * @returns The parsed reservation object.
 */
export function ParseReservation(
  reservationThing: Thing,
  datasetUrl: string
): ReservationAtHotel {
  let state: ReservationState =
    ReverseReservationStateRdfMap[
      getUrl(reservationThing, ReservationFieldToRdfMap.state) ?? 0
    ];
  //Annoying retyping trick so we get a correct ENUM value instead of a string
  state =
    ReservationState[ReservationState[state] as keyof typeof ReservationState];

  // TODO: modify No Id and No Name
  const reservation = {
    id: GetIdFromDatasetUrl(datasetUrl, 1),
    inbox: getStringNoLocale(reservationThing, ReservationFieldToRdfMap.inbox),
    owner:
      getStringNoLocale(reservationThing, ReservationFieldToRdfMap.owner) ??
      "<No owner ID>",
    hotel:
      getUrl(reservationThing, ReservationFieldToRdfMap.hotel) ??
      "<No hotel WebId>",
    room:
      getUrl(reservationThing, ReservationFieldToRdfMap.room) ?? "<No room ID>",
    state: state,
    dateFrom:
      getDatetime(reservationThing, ReservationFieldToRdfMap.checkinTime) ??
      // TODO: change default value here
      new Date(),
    dateTo:
      getDatetime(reservationThing, ReservationFieldToRdfMap.checkoutTime) ??
      // TODO: change default value here
      new Date(),
  };

  return reservation;
}

/**
 * Retrieves the reservation {@link Thing} from the dataset and delegated the parsing to the method above.
 * @returns The parsed reservation or null (if there's an issue with the dataset).
 */
function ConvertToReservation(
  dataset: SolidDataset,
  url: string
): ReservationAtHotel | null {
  const reservationThing = GetThing(dataset, "reservation");
  if (!reservationThing) {
    return null;
  }

  return ParseReservation(reservationThing, url);
}

/**
 * Fetches the reservations contained in the container whose URL is passed to the function.
 * If no URL is passed, the SWR hook doesn't get called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The reservations and further flags representing the state of the fetch (isLoading, isError).
 */
export function useReservations(reservationsUrl: string | null): {
  items: (ReservationAtHotel | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  if (!reservationsUrl) {
    return { items: undefined, isLoading: false, isError: true };
  }

  const fetchResult = FetchItems<ReservationAtHotel>(
    swrKey,
    reservationsUrl,
    ConvertToReservation,
    (itemUrl) => {
      return itemUrl + "reservation";
    }
  );

  if (fetchResult.isValidating) {
    AddLoadingIndicator(swrKey);
  } else {
    RemoveLoadingIndicator(swrKey);
  }

  return fetchResult;
}

/**
 * Triggers a refetch of the reservations.
 */
export function RevalidateReservations(): void {
  mutate(swrKey);
}
