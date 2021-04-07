import { useRouter } from "next/router";
import { Box, Button, Typography } from "@material-ui/core";
import { BookingPage } from "../../pages/booking";

function BookingSuccessPage({
  currentPage,
}: {
  currentPage: BookingPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== BookingPage.Success) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Reservation successful!</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Return to index page
      </Button>
    </Box>
  );
}

export default BookingSuccessPage;
