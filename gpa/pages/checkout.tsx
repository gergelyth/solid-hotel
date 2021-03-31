import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { useState } from "react";
import ActiveReservationList from "../components/checkout/active-reservation-list";
import CheckoutButton from "../components/checkout/checkout-button";
import { Grid, Typography } from "@material-ui/core";

export type ActiveReservationElement = {
  reservation: ReservationAtHotel;
  reservationElement: HTMLElement;
};

export function GetActiveReservations(
  reservations: (ReservationAtHotel | null)[] | undefined
): ReservationAtHotel[] {
  if (!reservations) {
    return [];
  }

  const activeReservations: ReservationAtHotel[] = [];
  reservations.forEach((reservation) => {
    if (reservation != null && reservation.state === ReservationState.ACTIVE) {
      activeReservations.push(reservation);
    }
  });

  return activeReservations;
}

function Checkout(): JSX.Element {
  const [
    selectedReservation,
    setSelectedReservation,
  ] = useState<ActiveReservationElement>();

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography>Active reservations</Typography>
      </Grid>
      <Grid item>
        <ActiveReservationList
          selectedReservation={selectedReservation}
          setSelectedReservation={setSelectedReservation}
        />
      </Grid>
      <Grid item>
        <CheckoutButton reservationId={selectedReservation?.reservation.id} />
      </Grid>
    </Grid>
  );
}

export default Checkout;
