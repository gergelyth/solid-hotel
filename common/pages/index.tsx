import {
  Badge,
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
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
  GetDeserializeFunction,
  GetSerializeFunction,
} from "../setup/testDataButtons";
import {
  GetGuestClearEverythingFunction,
  GetGuestEmptySetupFunction,
} from "../setup/populateUserPod/guestSetupButtons";
import { ReactNode } from "react";
import {
  Backup,
  Save,
  DeleteForever,
  FolderOpen,
  Person,
  Info,
} from "@material-ui/icons";
import HomeIcon from "@material-ui/icons/Home";

type SetupButton = {
  buttonText: string;
  onClick: () => void;
  icon?: ReactNode;
  info?: JSX.Element;
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
                {setupButton.info ? (
                  <InfoPopover content={setupButton.info} />
                ) : null}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Badge>
    </Grid>
  );
}

const CustomTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #dadde9",
    maxWidth: "100%",
  },
}))(Tooltip);

function InfoPopover({ content }: { content: JSX.Element }): JSX.Element {
  return (
    <CustomTooltip title={content}>
      <Badge badgeContent={<Info color={"primary"} />} />
    </CustomTooltip>
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
