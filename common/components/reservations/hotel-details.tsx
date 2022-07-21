import { useHotel } from "../../hooks/useHotel";
import { Box, Typography } from "@material-ui/core";
import { ReverseCountryToRdfMap } from "../../vocabularies/rdfCountries";

/**
 * In order to display a more pleasant representation of the country, we look up the country code assigned to the RDF name.
 * @returns The 3 letter country code assigned to the RDF or the RDF if the country is not supported.
 */
function GetCountryDisplayName(countryRdf: string): string {
  return ReverseCountryToRdfMap[countryRdf] ?? countryRdf;
}

/**
 * Retrieves the hotel details from the hotel profile tied to the webId supplied.
 * @returns A string with the hotel name and its location.
 */
export function GetHotelInformation(hotelWebId: string): string {
  const { hotelDetails, isLoading, isError } = useHotel(hotelWebId);

  if (isLoading) {
    return "Loading hotel information...";
  }
  if (isError || !hotelDetails) {
    return "Error loading hotel information";
  }

  return `${hotelDetails.name}, ${GetCountryDisplayName(
    hotelDetails.location
  )}`;
}

/**
 * Retrieves the hotel details from the hotel profile tied to the webId supplied.
 * @returns A one-line component displaying the hotel name and its location.
 */
export function HotelDetailsOneLiner({
  hotelWebId,
}: {
  hotelWebId: string;
}): JSX.Element {
  const hotelDetails = GetHotelInformation(hotelWebId);
  return <Typography variant="body2">{hotelDetails}</Typography>;
}

/**
 * Retrieves the hotel details from the hotel profile tied to the webId supplied.
 * @returns A two-line component where the first line contains the hotel name and location and the second line is the address of the hotel.
 */
export function HotelDetailsTwoLiner({
  hotelWebId,
}: {
  hotelWebId: string;
}): JSX.Element {
  const { hotelDetails, isLoading, isError } = useHotel(hotelWebId);

  const hotelInformation = GetHotelInformation(hotelWebId);

  let hotelAddress: string;

  if (isLoading) {
    hotelAddress = "Loading hotel address...";
  } else if (isError || !hotelDetails) {
    hotelAddress = "Error loading hotel address";
  } else {
    hotelAddress = hotelDetails.address;
  }

  return (
    <Box>
      <Typography variant="body2">{hotelInformation}</Typography>
      <Typography variant="body2">{hotelAddress}</Typography>
    </Box>
  );
}
