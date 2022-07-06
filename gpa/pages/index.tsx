import Link from "next/link";
import { useReservations } from "../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetActiveReservations } from "../components/checkout/reservationselect-subpage";
import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { ErrorComponent } from "../../common/components/error-component";
import { GetSession } from "../../common/util/solid";

function CheckoutButton({
  reservationsResult,
}: {
  reservationsResult: {
    items: (ReservationAtHotel | null)[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
}): JSX.Element {
  if (reservationsResult.isLoading) {
    return <CircularProgress />;
  }

  if (reservationsResult.isError || !reservationsResult.items) {
    return <ErrorComponent />;
  }

  if (GetActiveReservations(reservationsResult.items).length == 0) {
    return (
      <i>
        <Typography>No active reservations</Typography>
      </i>
    );
  } else {
    return (
      <Link href="/checkout">
        <Button variant="contained" color="primary" size="large">
          Checkout
        </Button>
      </Link>
    );
  }
}

export default function Home(): JSX.Element {
  const isLoggedIn = GetSession().info.isLoggedIn;
  const reservationsResult = useReservations(GetUserReservationsPodUrl());

  return (
    <Grid
      container
      spacing={5}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Guest Portal Application</Typography>
      </Grid>

      <Grid item>
        <Link href="/booking">
          <Button variant="contained" color="primary" size="large">
            Book a room
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link href="/reservations">
          <Button variant="contained" color="primary" size="large">
            List reservations
          </Button>
        </Link>
      </Grid>
      {isLoggedIn ? (
        <Grid item>
          <CheckoutButton reservationsResult={reservationsResult} />
        </Grid>
      ) : null}
      <Grid item>
        <Link href="/privacy">
          <Button variant="contained" color="primary" size="large">
            Privacy dashboard
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link href="/profile">
          <Button variant="contained" color="primary" size="large">
            Profile editor
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}
