import { CountryToRdfMap } from "../vocabularies/rdfCountries";

/**
 * @constant An example name of hotel name which is set in the hotel profile.
 * @default
 */
export const HotelName = "Paradise Hotel";

/**
 * @constant An example name of hotel country which is set in the hotel profile - loaded from the ENV config.
 * @default
 */
export const HotelLocation =
  process.env.NEXT_PUBLIC_HOTEL_LOCATION ?? CountryToRdfMap.FRA;

/**
 * @constant An example name of hotel address which is set in the hotel profile.
 * @default
 */
export const HotelAddress = "3884 Sunrise Avenue, 43122, Paris";
