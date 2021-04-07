import { useRouter } from "next/router";
import { Box, Button, Typography } from "@material-ui/core";
import { CheckinPage } from "../../pages/reservations/[id]";

function CheckinSuccessPage({
  currentPage,
}: {
  currentPage: CheckinPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== CheckinPage.Success) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Check-in successful!</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/reservations")}
      >
        Return to reservations
      </Button>
    </Box>
  );
}

export default CheckinSuccessPage;
