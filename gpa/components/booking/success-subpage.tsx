import { NextRouter } from "next/router";
import { Box, Button, Typography } from "@material-ui/core";
import { BookingPage } from "../../pages/booking";

function BookingSuccessPage({
  currentPage,
  router,
}: {
  currentPage: BookingPage;
  router: NextRouter;
}): JSX.Element | null {
  if (currentPage !== BookingPage.Success) {
    return null;
  }

  return (
    <Box>
      <h2>
        <Typography>Reservation successful!</Typography>
      </h2>
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
