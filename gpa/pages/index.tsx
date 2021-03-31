import Link from "next/link";
import { useReservations } from "../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetActiveReservations } from "./checkout";
import LoginButtonComponent from "../../common/components/auth/login-component";
import { GetUserReservationsPodUrl } from "../../common/util/solid";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
// import { SetField } from "../util/solid";
// import { personFieldToRdfMap } from "../vocabularies/rdf_person";
// import PopulateHotelPodWithReservations from "../test/setup/populateHotelPod/withReservations";
// import PopulateHotelPodWithRooms from "../test/setup/populateHotelPod/withRooms";

function CheckoutButton(
  reservations: (ReservationAtHotel | null)[] | undefined,
  isLoading: boolean,
  isError: boolean
): JSX.Element {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    <Container maxWidth="sm">
      <Typography>An error occurred.</Typography>
      <Typography>{isError}</Typography>
    </Container>;
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
        <Button variant="contained" color="primary">
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
    <Container maxWidth="sm">
      <main>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <h1>
              <Typography>Guest Portal Application</Typography>
            </h1>
          </Grid>
          <Grid item>
            <Typography>Click on the links to navigate</Typography>
          </Grid>
          {/* <button
          onClick={async () => {
            await SetField(personFieldToRdfMap.nationality, "Spanish");
          }}
        >
          Set nationality
        </button> */}
          {/* <button
          onClick={async () => {
            await SetField(personFieldToRdfMap.firstName, "Stephen");
          }}
        >
          Set first name to Stephen
        </button>

        <button onClick={PopulateHotelPodWithReservations}>
          Populate hotel Pod with reservations (signed into HotelPod)
        </button>

        <button onClick={PopulateHotelPodWithRooms}>
          Populate hotel Pod with rooms (signed into HotelPod)
        </button> */}

          <Grid item>
            <LoginButtonComponent />
          </Grid>

          <Grid item>
            <Link href="/booking">
              <Button variant="contained" color="primary">
                Book a room
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/reservations">
              <Button variant="contained" color="primary">
                List reservations
              </Button>
            </Link>
          </Grid>
          <Grid item>{CheckoutButton(items, isLoading, isError)}</Grid>
          <Grid item>
            <Link href="/profile">
              <Button variant="contained" color="primary">
                Profile editor
              </Button>
            </Link>
          </Grid>
        </Grid>
      </main>

      <footer>
        <Typography>MIT License</Typography>
      </footer>
    </Container>
  );
}
