import Link from "next/link";
import { useReservations } from "../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetActiveReservations } from "../components/checkout/reservationselect-subpage";
import { GetUserReservationsPodUrl } from "../../common/util/solid";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";

function CheckoutButton(
  reservations: (ReservationAtHotel | null)[] | undefined,
  isLoading: boolean,
  isError: boolean
): JSX.Element {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !reservations) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  if (GetActiveReservations(reservations).length == 0) {
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

// TODO: login status doesn't survive refresh
export default function Home(): JSX.Element {
  const { items, isLoading, isError } = useReservations(
    GetUserReservationsPodUrl()
  );

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
      <Grid item>{CheckoutButton(items, isLoading, isError)}</Grid>
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
