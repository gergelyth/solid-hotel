import { Box, Grid, Typography } from "@material-ui/core";
import { HotelWebId } from "../consts/solidIdentifiers";
import { HotelName, HotelLocation } from "../consts/hotelConsts";
import { DynamicLoginComponent } from "../components/auth/dynamic-login-component";
import { GetSession } from "../util/solid";
import {
  GetAddRoomsFunction,
  GetClearAllButRoomsFunction,
  GetClearAllRoomsFunction,
  GetCreateEmptySetupFunction,
  GetSetupHotelProfileFunction,
} from "../setup/populateHotelPod/hotelSetupButtons";
import {
  GuestFoldersOfInterest,
  HotelFoldersOfInterest,
} from "../setup/testDataButtons";
import {
  GetGuestClearEverythingFunction,
  GetGuestEmptySetupFunction,
} from "../setup/populateUserPod/guestSetupButtons";
import { DeleteForever, FolderOpen, Person } from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";
import {
  SetupButtonGroup,
  TestDataSetupButtons,
} from "../components/setup/setup-components";

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

      <Grid
        container
        spacing={3}
        alignItems="center"
        justify="center"
        direction="column"
      >
        <SetupButtonGroup
          title={"Clear"}
          buttons={[
            {
              buttonText: "Clear all but rooms",
              onClick: GetClearAllButRoomsFunction(),
              icon: <DeleteForever />,
            },
            {
              buttonText: "Clear rooms",
              onClick: GetClearAllRoomsFunction(),
              icon: <DeleteForever />,
            },
          ]}
          isClearGroup
        />
        <SetupButtonGroup
          title={"Manual setup"}
          buttons={[
            {
              buttonText: "Empty setup",
              onClick: GetCreateEmptySetupFunction(),
              icon: <FolderOpen />,
            },
            {
              buttonText: "Setup hotel profile",
              onClick: GetSetupHotelProfileFunction(),
              icon: <Person />,
              info: (
                <Box>
                  <Typography variant="subtitle2">
                    Hotel WebId: {HotelWebId}
                  </Typography>
                  <Typography variant="subtitle2">
                    Hotel name: {HotelName}
                  </Typography>
                  <Typography variant="subtitle2">
                    Hotel location: {HotelLocation}
                  </Typography>
                </Box>
              ),
            },
            {
              buttonText: "Add rooms",
              onClick: GetAddRoomsFunction(),
              icon: <HomeIcon />,
            },
          ]}
        />
        <TestDataSetupButtons
          zipName="serializedHotel.zip"
          foldersOfInterest={HotelFoldersOfInterest}
        />
      </Grid>

      <Grid item>
        <Typography variant="h6">Guest Pod setup</Typography>
      </Grid>

      <Grid
        container
        spacing={3}
        alignItems="center"
        justify="center"
        direction="column"
      >
        <SetupButtonGroup
          title={"Clear"}
          buttons={[
            {
              buttonText: "Clear everything",
              onClick: GetGuestClearEverythingFunction(),
              icon: <DeleteForever />,
            },
          ]}
          isClearGroup
        />
        <SetupButtonGroup
          title={"Manual setup"}
          buttons={[
            {
              buttonText: "Empty setup",
              onClick: GetGuestEmptySetupFunction(),
              icon: <FolderOpen />,
            },
          ]}
        />
        <TestDataSetupButtons
          zipName="serializedGuest.zip"
          foldersOfInterest={GuestFoldersOfInterest}
        />
      </Grid>
    </Grid>
  );
}
