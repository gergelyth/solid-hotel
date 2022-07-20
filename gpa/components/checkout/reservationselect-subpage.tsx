import { Dispatch, SetStateAction, useState } from "react";
import { CheckoutButton } from "./checkout-button";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { CheckoutPage } from "../../pages/checkout";
import { useReservations } from "../../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../../common/util/solidReservations";
import { NotEmptyItem } from "../../../common/util/helpers";
import { ReservationState } from "../../../common/types/ReservationState";
import { ReservationRadioSelector } from "./radio-reservation-selector";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ErrorComponent } from "../../../common/components/error-component";

//TODO this is duplicated in reservation-list almost
/**
 * Filters out empty reservations and those whose state is not ACTIVE.
 * @returns An array of non-empty ACTIVE reservations.
 */
export function GetActiveReservations(
  reservations: (ReservationAtHotel | null)[]
): ReservationAtHotel[] {
  const filteredReservations = reservations
    .filter(NotEmptyItem)
    .filter((item) => item.state === ReservationState.ACTIVE);

  return filteredReservations;
}

/**
 * The main component for the check-out activity.
 * Retrieves the reservations and calls {@link ReservationRadioSelector} with the filter to show only ACTIVE reservations.
 * If a reservation is selected, the check-out button gets enabled and the user can start the check-out process by clicking on the button.
 * @returns A component containing the reservation selector and the check-out button.
 */
export function ReservationSelectForCheckout({
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
    return <ErrorComponent />;
  }

  const filteredReservations = GetActiveReservations(items);
  const isArrayNonEmpty = filteredReservations.length > 0;

  return (
    <Grid
      container
      spacing={5}
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Checkout</Typography>
      </Grid>
      <Box>
        <Grid item container justifyContent="flex-start">
          <Box px={2} fontWeight="fontWeightBold">
            <Typography variant="body1">Active reservations</Typography>
          </Box>
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
