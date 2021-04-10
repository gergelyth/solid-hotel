import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { HotelWebId } from "../consts/solidIdentifiers";
import { HotelName, HotelLocation } from "../consts/hotelConsts";
import { DynamicLoginComponent } from "../components/auth/dynamic-login-component";
import SetupHotelProfile from "../setup/populateHotelPod/hotelProfile";
import PopulateHotelPodWithReservations from "../setup/populateHotelPod/withReservations";
import PopulateHotelPodWithRooms from "../setup/populateHotelPod/withRooms";
import {
  DeleteAllHotelRooms,
  DeleteAllHotelCancellations,
  DeleteAllHotelReservations,
} from "../setup/populateHotelPod/util";
import { DeleteAllUserReservations } from "../setup/populateUserPod/util";
import PopulateUserPodWithReservations from "../setup/populateUserPod/withReservations";

// TODO: login status doesn't survive refresh
export default function Home(): JSX.Element {
  return (
    <Grid
      container
      spacing={6}
      alignItems="center"
      justify="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Setup screen</Typography>
      </Grid>

      <Grid item>
        <Typography variant="h6">
          Hotel Pod setup (TODO currently needs a manual hotel login - redo this
          to use the secrets)
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="subtitle1">Hotel WebId: {HotelWebId}</Typography>
        <Typography variant="subtitle1">Hotel name: {HotelName}</Typography>
        <Typography variant="subtitle1">
          Hotel location: {HotelLocation}
        </Typography>
      </Grid>

      {/* TODO add snackbar notifications for these operations */}

      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid item>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            variant="contained"
          >
            <Button
              onClick={async () => {
                await DeleteAllHotelCancellations();
              }}
            >
              Clear cancellations
            </Button>
            <Button
              onClick={async () => {
                await DeleteAllHotelReservations();
              }}
            >
              Clear reservations
            </Button>
            <Button
              onClick={async () => {
                await DeleteAllHotelRooms();
              }}
            >
              Clear rooms
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            variant="contained"
          >
            <Button onClick={SetupHotelProfile}>Setup hotel profile</Button>
            <Button
              onClick={() =>
                //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                PopulateHotelPodWithReservations(
                  "https://gergelyth.inrupt.net/profile/card#me"
                )
              }
            >
              Add reservations
            </Button>
            <Button onClick={PopulateHotelPodWithRooms}>Add rooms</Button>
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid item>
        <Typography variant="h6">Guest Pod setup - log in to work</Typography>
      </Grid>

      <Grid item>
        <DynamicLoginComponent />
      </Grid>

      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid item>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            variant="contained"
          >
            <Button
              onClick={async () => {
                await DeleteAllUserReservations();
              }}
            >
              Clear reservations
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            variant="contained"
          >
            <Button
              onClick={() =>
                //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                PopulateUserPodWithReservations(
                  "https://gergelyth.inrupt.net/profile/card#me"
                )
              }
            >
              Add reservations
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
