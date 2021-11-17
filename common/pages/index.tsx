import { Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import {
  HotelWebId,
  PrivacyTokensInboxUrl,
  PrivacyTokensUrl,
} from "../consts/solidIdentifiers";
import { HotelName, HotelLocation } from "../consts/hotelConsts";
import { DynamicLoginComponent } from "../components/auth/dynamic-login-component";
import SetupHotelProfile from "../setup/populateHotelPod/hotelProfile";
import {
  PopulateHotelPodWithReservations,
  CreateBookingInbox,
} from "../setup/populateHotelPod/withReservations";
import PopulateHotelPodWithRooms from "../setup/populateHotelPod/withRooms";
import {
  DeleteAllHotelRooms,
  DeleteAllHotelReservations,
  DeleteAllProfiles,
  DeletePrivacyFolders,
} from "../setup/populateHotelPod/util";
import {
  DeleteAllUserReservations,
  DeleteUserPrivacyFolders,
} from "../setup/populateUserPod/util";
import PopulateUserPodWithReservations from "../setup/populateUserPod/withReservations";
import { GetPodOfSession, GetSession } from "../util/solid";
import { ShowInfoSnackbar, ShowSuccessSnackbar } from "../components/snackbar";
import {
  PopulateHotelPodWithActiveProfiles,
  PopulateHotelPodWithDataProtectionProfiles,
} from "../setup/populateHotelPod/withProfiles";
import { CreatePrivacyFolders } from "../setup/shared";

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
                ShowInfoSnackbar("Deleting privacy folders...");
                await DeletePrivacyFolders();
                ShowSuccessSnackbar("All privacy folders deleted");
              }}
            >
              Delete privacy folders
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar(
                  "Deleting hotel and data protection profiles..."
                );
                await DeleteAllProfiles();
                ShowSuccessSnackbar(
                  "All hotel and data protection profiles deleted"
                );
                ShowInfoSnackbar("Deleting hotel reservations...");
                await DeleteAllHotelReservations();
                ShowSuccessSnackbar("All hotel reservations deleted");
              }}
            >
              Clear reservations
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar("Deleting hotel rooms...");
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
              onClick={async () => {
                ShowInfoSnackbar("Adding information to the hotel profile...");
                await SetupHotelProfile();
                ShowSuccessSnackbar("Hotel profile setup successful");
              }}
            >
              Setup hotel profile
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar(
                  "Populating hotel Pod with active and data protection profiles..."
                );
                Promise.all([
                  PopulateHotelPodWithActiveProfiles(),
                  PopulateHotelPodWithDataProtectionProfiles(),
                ]).then(async ([activeProfiles, dataProtectionProfiles]) => {
                  ShowSuccessSnackbar(
                    "Hotel Pod populated with active and data protection profiles"
                  );
                  ShowInfoSnackbar(
                    "Populating hotel Pod with reservations and creating booking inbox..."
                  );
                  await Promise.all([
                    //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                    PopulateHotelPodWithReservations(
                      "https://gergelyth.inrupt.net/profile/card#me",
                      activeProfiles,
                      dataProtectionProfiles
                    ),
                    await CreateBookingInbox(),
                  ]);
                  ShowSuccessSnackbar("Hotel Pod populated with reservations");
                });
              }}
            >
              Add reservations
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar("Populating hotel Pod with rooms...");
                await PopulateHotelPodWithRooms();
                ShowSuccessSnackbar("Hotel Pod populated with rooms");
              }}
            >
              Add rooms
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar("Creating privacy folders...");
                await CreatePrivacyFolders(
                  PrivacyTokensUrl,
                  PrivacyTokensInboxUrl
                );
                ShowSuccessSnackbar("Privacy folders created");
              }}
            >
              Create privacy folders
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
                ShowInfoSnackbar("Deleting user privacy folders...");
                await DeleteUserPrivacyFolders();
                ShowSuccessSnackbar(
                  "All user privacy folders have been deleted"
                );
              }}
            >
              Delete privacy folders
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar("Deleting user reservations...");
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
              onClick={async () => {
                ShowInfoSnackbar("Populating user Pod with reservations...");
                //TODO hardcoded - should be the WebId of the currently logged in user when the hotel operations work with the secrets
                await PopulateUserPodWithReservations(
                  "https://gergelyth.inrupt.net/profile/card#me"
                );
                ShowSuccessSnackbar("Reservations added to user pod");
              }}
            >
              Add reservations
            </Button>
            <Button
              onClick={async () => {
                ShowInfoSnackbar("Creating privacy folders...");
                //TODO make this a variable
                await CreatePrivacyFolders(GetPodOfSession() + "/privacy");
                ShowSuccessSnackbar("Privacy folders created");
              }}
            >
              Create privacy folders
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
