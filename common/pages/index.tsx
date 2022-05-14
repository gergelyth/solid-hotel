import { Badge, Box, Button, Grid, Typography } from "@material-ui/core";
import { HotelWebId } from "../consts/solidIdentifiers";
import { HotelName, HotelLocation } from "../consts/hotelConsts";
import { DynamicLoginComponent } from "../components/auth/dynamic-login-component";
import { GetSession } from "../util/solid";
import {
  GetAddReservationsFunction,
  GetAddRoomsFunction,
  GetClearAllButRoomsFunction,
  GetClearAllRoomsFunction,
  GetCreateEmptySetupFunction,
  GetSetupHotelProfileFunction,
} from "../setup/hotelSetupButtons";
import {
  GetDeserializeFunction,
  GetSerializeFunction,
} from "../setup/testDataButtons";
import {
  GetGuestAddReservationsFunction,
  GetGuestClearEverythingFunction,
  GetGuestEmptySetupFunction,
} from "../setup/guestSetupButtons";
import { ReactNode } from "react";
import {
  Backup,
  Save,
  DeleteForever,
  FolderOpen,
  Person,
} from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";

type SetupButton = {
  buttonText: string;
  onClick: () => void;
  icon?: ReactNode;
};

function SetupButtonGroup({
  title,
  buttons,
  isClearGroup,
}: {
  title: string;
  buttons: SetupButton[];
  isClearGroup?: boolean;
}): JSX.Element {
  return (
    <Grid item>
      <Badge
        badgeContent={title}
        color={isClearGroup ? "secondary" : "primary"}
      >
        <Box
          border={1}
          p={3}
          borderRadius={16}
          // borderColor={isClearGroup ? "secondary.main" : "primary.main"}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="center"
            direction="row"
          >
            {buttons.map((setupButton) => (
              <Grid item key={setupButton.buttonText}>
                <Button
                  variant="outlined"
                  color={isClearGroup ? "secondary" : "primary"}
                  startIcon={setupButton.icon}
                  onClick={setupButton.onClick}
                >
                  {setupButton.buttonText}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Badge>
    </Grid>
  );
}

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
              buttonText: "Clear",
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
            },
            {
              buttonText: "Add reservations",
              onClick: GetAddReservationsFunction(),
            },
            {
              buttonText: "Add rooms",
              onClick: GetAddRoomsFunction(),
              icon: <HomeIcon />,
            },
          ]}
        />
        <SetupButtonGroup
          title={"TestData"}
          buttons={[
            {
              buttonText: "Serialize Pod",
              onClick: GetSerializeFunction(),
              icon: <Save />,
            },
            {
              buttonText: "Load TestData",
              onClick: GetDeserializeFunction(),
              icon: <Backup />,
            },
          ]}
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
            {
              buttonText: "Add reservations",
              onClick: GetGuestAddReservationsFunction(),
            },
          ]}
        />
        <SetupButtonGroup
          title={"TestData"}
          buttons={[
            {
              buttonText: "Serialize Pod",
              onClick: GetSerializeFunction(),
              icon: <Save />,
            },
            {
              buttonText: "Load TestData",
              onClick: GetDeserializeFunction(),
              icon: <Backup />,
            },
          ]}
        />
      </Grid>
    </Grid>
  );
}
