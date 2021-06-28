import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { HotelWebId } from "../consts/solidIdentifiers";
import { HotelName, HotelLocation } from "../consts/hotelConsts";
import { DynamicLoginComponent } from "../components/auth/dynamic-login-component";
import SetupHotelProfile from "../setup/populateHotelPod/hotelProfile";
import PopulateHotelPodWithReservations from "../setup/populateHotelPod/withReservations";
import PopulateHotelPodWithRooms from "../setup/populateHotelPod/withRooms";
import {
  DeleteAllHotelRooms,
  DeleteAllHotelReservations,
} from "../setup/populateHotelPod/util";
import { DeleteAllUserReservations } from "../setup/populateUserPod/util";
import PopulateUserPodWithReservations from "../setup/populateUserPod/withReservations";
import { GetSession } from "../util/solid";
import { ShowSuccessSnackbar } from "../components/snackbar";
import {
  PopulateHotelPodWithActiveProfiles,
  PopulateHotelPodWithDataProtectionProfiles,
} from "../setup/populateHotelPod/withProfiles";

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
        <DynamicLoginComponent />
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Logged in as: {GetSession()?.info.webId ?? "NOT LOGGED IN"}
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="h6">Test accounts:</Typography>
        <Typography variant="subtitle1">{HotelWebId}</Typography>
        {/* TODO: change this! */}
        <Typography variant="subtitle1">
          https://gergelyth.inrupt.net/profile/card#me
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="h6">Hotel Pod setup</Typography>
      </Grid>

      <Grid item>
        <Typography variant="subtitle1">Hotel WebId: {HotelWebId}</Typography>
        <Typography variant="subtitle1">Hotel name: {HotelName}</Typography>
        <Typography variant="subtitle1">
          Hotel location: {HotelLocation}
        </Typography>
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
                await DeleteAllHotelReservations();
                ShowSuccessSnackbar("All hotel reservations deleted");
              }}
            >
              Clear reservations
            </Button>
            <Button
              onClick={async () => {
                await DeleteAllHotelRooms();
                ShowSuccessSnackbar("All hotel rooms deleted");
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
            <Button
              onClick={() => {
                SetupHotelProfile();
                ShowSuccessSnackbar("Hotel profile setup successful");
              }}
            >
              Setup hotel profile
            </Button>
            <Button
              onClick={() => {
                //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                PopulateHotelPodWithReservations(
                  "https://gergelyth.inrupt.net/profile/card#me"
                );
                ShowSuccessSnackbar("Hotel Pod populated with reservations");
              }}
            >
              Add reservations
            </Button>
            <Button
              onClick={() => {
                PopulateHotelPodWithRooms();
                ShowSuccessSnackbar("Hotel Pod populated with rooms");
              }}
            >
              Add rooms
            </Button>
            <Button
              onClick={() => {
                PopulateHotelPodWithActiveProfiles();
                PopulateHotelPodWithDataProtectionProfiles();
                ShowSuccessSnackbar(
                  "Hotel Pod populated with active and data protection profiles"
                );
              }}
            >
              Add profiles
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid item>
        <Typography variant="h6">Guest Pod setup</Typography>
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
                ShowSuccessSnackbar("All user reservations have been deleted");
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
              onClick={() => {
                //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                PopulateUserPodWithReservations(
                  "https://gergelyth.inrupt.net/profile/card#me"
                );
                ShowSuccessSnackbar("Reservations added to user pod");
              }}
            >
              Add reservations
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
