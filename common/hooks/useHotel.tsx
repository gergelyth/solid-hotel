import { getStringNoLocale, getUrl, Thing } from "@inrupt/solid-client";
import useSWR from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { HotelDetails } from "../types/HotelDetails";
import { ReportParsingFailure } from "../util/helpers";
import { GetProfileOf } from "../util/solidProfile";
import { HotelFieldToRdfMap } from "../vocabularies/rdfHotel";

/**
 * Creates the hotel SWR key distinguishing between possible cases to make sure one case's cache is not used for another case's retrieval.
 * @returns The hotel SWR key fit for the specific case.
 */
function CreateSwrKey(hotelWebId: string | undefined): string[] | null {
  const swrKey = "hotel";
  return hotelWebId ? [swrKey, hotelWebId] : null;
}

/**
 * Parses the hotel profile fields retrieved from the Solid Pod.
 * @returns The hotel details or undefined if one of the passed arguments is wrong.
 */
function ConvertToHotelDetails(
  hotelProfile: Thing | null | undefined,
  hotelWebId: string | undefined
): HotelDetails | undefined {
  if (!hotelWebId || !hotelProfile) {
    return undefined;
  }

  const hotel = {
    webId: hotelWebId,
    name:
      getStringNoLocale(hotelProfile, HotelFieldToRdfMap.name) ??
      ReportParsingFailure("hotel", "name", "<No hotel name>"),
    location:
      getUrl(hotelProfile, HotelFieldToRdfMap.location) ??
      ReportParsingFailure("hotel", "location", "<No hotel location>"),
    address:
      getStringNoLocale(hotelProfile, HotelFieldToRdfMap.address) ??
      ReportParsingFailure("hotel", "address", "<No hotel address>"),
  };

  return hotel;
}

/**
 * Fetches the profile of the hotel and returns the details regarding it (name, location, address).
 * If the hotel WebId doesn't get passed, the SWR hook doesn't get called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The hotel details and further flags representing the state of the fetch (isLoading, isError).
 */
export function useHotel(hotelWebId: string | undefined): {
  hotelDetails: HotelDetails | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<HotelDetails | undefined> => {
    return GetProfileOf(hotelWebId).then((solidProfile) =>
      ConvertToHotelDetails(solidProfile?.profile, hotelWebId)
    );
  };

  const { data, error, isValidating } = useSWR(
    () => CreateSwrKey(hotelWebId),
    fetcher
  );

  const swrKey = CreateSwrKey(hotelWebId);
  if (swrKey) {
    const swrKeyString = swrKey.join();
    if (isValidating) {
      AddLoadingIndicator(swrKeyString);
    } else {
      RemoveLoadingIndicator(swrKeyString);
    }
  }

  return {
    hotelDetails: data,
    isLoading: !error && !data,
    isError: error,
  };
}
