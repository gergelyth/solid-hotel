import { useHotel } from "../../hooks/useHotel";
import { Box, Typography } from "@material-ui/core";

export function GetHotelInformation(hotelWebId: string): string {
  const { hotelDetails, isLoading, isError } = useHotel(hotelWebId);

  if (isLoading) {
    return "Loading hotel information...";
  }
  if (isError || !hotelDetails) {
    return "Error loading hotel information";
  }

  return `${hotelDetails.name}, ${hotelDetails.location}`;
}

function HotelDetails({ hotelWebId }: { hotelWebId: string }): JSX.Element {
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

export default HotelDetails;
