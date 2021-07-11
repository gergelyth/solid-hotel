import { Dispatch, SetStateAction, useState } from "react";
import CheckoutButton from "./checkout-button";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { CheckoutPage } from "../../pages/checkout";
import { useReservations } from "../../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../../common/util/solid_reservations";
import { NotEmptyItem } from "../../../common/util/helpers";
import { ReservationState } from "../../../common/types/ReservationState";
import ReservationRadioSelector from "./radio-reservation-selector";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";

//TODO this is duplicated in reservation-list almost
export function GetActiveReservations(
  reservations: (ReservationAtHotel | null)[]
): ReservationAtHotel[] {
  const filteredReservations = reservations
    .filter(NotEmptyItem)
    .filter((item) => item.state === ReservationState.ACTIVE);

  return filteredReservations;
}

function ReservationSelectForCheckout({
  currentPage,
  setCurrentPage,
}: {
  currentPage: CheckoutPage;
  setCurrentPage: Dispatch<SetStateAction<CheckoutPage>>;
}): JSX.Element | null {
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const { items, isLoading, isError } = useReservations(
    GetUserReservationsPodUrl()
  );

  if (currentPage !== CheckoutPage.ReservationSelect) {
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !items) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  const filteredReservations = GetActiveReservations(items);
  const isArrayNonEmpty = filteredReservations.length > 0;

  return (
    <Grid
      container
      spacing={5}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Checkout</Typography>
      </Grid>
      <Box>
        <Grid item justify="flex-start">
          <Typography variant="body1">
            <Box px={2} fontWeight="fontWeightBold">
              Active reservations
            </Box>
          </Typography>
        </Grid>
      </Box>
      <Grid item>
        {isArrayNonEmpty ? (
          <ReservationRadioSelector
            selectedReservationId={selectedReservationId}
            setSelectedReservationId={setSelectedReservationId}
            filteredReservations={filteredReservations}
          />
        ) : (
          <Box fontStyle="italic" textAlign="center">
            <Typography>No reservations found.</Typography>
          </Box>
        )}
      </Grid>
      <Grid item>
        <CheckoutButton
          reservationId={selectedReservationId}
          reservations={filteredReservations}
          onClickFunction={() => setCurrentPage(currentPage + 1)}
        />
      </Grid>
    </Grid>
  );
}

export default ReservationSelectForCheckout;
