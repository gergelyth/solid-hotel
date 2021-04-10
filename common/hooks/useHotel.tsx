import { getStringNoLocale, Thing } from "@inrupt/solid-client";
import useSWR from "swr";
import { HotelDetails } from "../types/HotelDetails";
import { GetProfileOf } from "../util/solid";
import { hotelFieldToRdfMap } from "../vocabularies/rdf_hotel";

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
      getStringNoLocale(hotelProfile, hotelFieldToRdfMap.name) ??
      "<No hotel name>",
    location:
      getStringNoLocale(hotelProfile, hotelFieldToRdfMap.location) ??
      "<No hotel location>",
  };

  return hotel;
}

export function useHotel(
  hotelWebId: string | undefined
): {
  hotelDetails: HotelDetails | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<HotelDetails | undefined> => {
    return GetProfileOf(hotelWebId).then((solidProfile) =>
      ConvertToHotelDetails(solidProfile?.profile, hotelWebId)
    );
  };

  const { data, error } = useSWR(() => hotelWebId ?? null, fetcher);

  return {
    hotelDetails: data,
    isLoading: !error && !data,
    isError: error,
  };
}
