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
  TestAccountCheck,
  TestDataSetupButtons,
} from "../components/setup/setup-components";

const HotelTestAccount = HotelWebId;
/* TODO: change this to solidguest! */
const GuestTestAccount = "https://gergelyth.inrupt.net/profile/card#me";

function HotelSetupSubPage(): JSX.Element {
  return (
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
  );
}

function GuestSetupSubPage(): JSX.Element {
  return (
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
  );
}

export default function Home(): JSX.Element {
  const webId = GetSession()?.info.webId;
  const isHotelTestAccount = webId === HotelTestAccount;
  const isGuestTestAccount = webId === GuestTestAccount;

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

      {webId ? null : (
        <Grid item>
          <TestAccountCheck
            type={"error"}
            content={
              <Typography variant="subtitle2" align="center">
                Not logged in
              </Typography>
            }
          />
        </Grid>
      )}

      {isHotelTestAccount ? (
        <Grid item>
          <TestAccountCheck
            type={"success"}
            content={
              <Box>
                <Typography variant="subtitle2" align="center">
                  Recognized as the hotel test account set up for this project.
                </Typography>
                <Typography variant="subtitle2" align="center">
                  All functionalities available.
                </Typography>
              </Box>
            }
          />
        </Grid>
      ) : null}

      {isGuestTestAccount ? (
        <Grid item>
          <TestAccountCheck
            type={"success"}
            content={
              <Box>
                <Typography variant="subtitle2" align="center">
                  Recognized as the guest test account set up for this project.
                </Typography>
                <Typography variant="subtitle2" align="center">
                  All functionalities available.
                </Typography>
              </Box>
            }
          />
        </Grid>
      ) : null}

      {webId && !isHotelTestAccount && !isGuestTestAccount ? (
        <Grid item>
          <TestAccountCheck
            type={"warning"}
            content={
              <Box>
                <Typography variant="subtitle2" align="center">
                  Not recognized as an account set up for this project.
                </Typography>
                <Typography variant="subtitle2" align="center">
                  Tread lightly.
                </Typography>
                <Typography variant="subtitle2" align="center">
                  Prepared test data not applicable here.
                </Typography>
              </Box>
            }
          />
        </Grid>
      ) : null}

      {webId && !isGuestTestAccount ? (
        <Grid item>
          <Typography variant="h6">Hotel Pod setup</Typography>
        </Grid>
      ) : null}
      {webId && !isGuestTestAccount ? <HotelSetupSubPage /> : null}

      {webId && !isHotelTestAccount ? (
        <Grid item>
          <Typography variant="h6">Guest Pod setup</Typography>
        </Grid>
      ) : null}
      {webId && !isHotelTestAccount ? <GuestSetupSubPage /> : null}
    </Grid>
  );
}
