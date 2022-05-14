import {
  Badge,
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { ReactNode } from "react";
import { Info, Backup, Save, Done, Warning, Error } from "@material-ui/icons";
import {
  GetDeserializeFunction,
  GetSerializeFunction,
} from "../../setup/testDataButtons";
import { green, red, yellow } from "@material-ui/core/colors";

export type SetupButton = {
  buttonText: string;
  onClick: () => void;
  icon?: ReactNode;
  info?: JSX.Element;
};

export function SetupButtonGroup({
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
    <Badge
      badgeContent={
        <CustomTooltip title={content}>
          <Info color={"primary"} />
        </CustomTooltip>
      }
    />
  );
}

export function TestDataSetupButtons({
  zipName,
  foldersOfInterest,
}: {
  zipName: string;
  foldersOfInterest: string[];
}): JSX.Element {
  return (
    <SetupButtonGroup
      title={"TestData"}
      buttons={[
        {
          buttonText: "Serialize Pod",
          onClick: GetSerializeFunction(zipName, foldersOfInterest),
          icon: <Save />,
          info: (
            <Box>
              <Typography variant="body1">Folders of interest:</Typography>
              {foldersOfInterest.map((folder) => (
                <Typography variant="subtitle2" key={folder}>
                  {folder}
                </Typography>
              ))}
            </Box>
          ),
        },
        {
          buttonText: "Load TestData",
          onClick: GetDeserializeFunction(zipName),
          icon: <Backup />,
        },
      ]}
    />
  );
}

function TestAccountCheckTitle({
  titleString,
  color,
  icon,
}: {
  titleString: string;
  color: string;
  icon: ReactNode;
}): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justify="center"
      direction="row"
    >
      <Grid item> {icon}</Grid>
      <Grid item>
        <Typography variant="h4" style={{ color: color }}>
          <Box fontFamily="Monospace" fontWeight="fontWeightBold">
            {titleString}
          </Box>
        </Typography>
      </Grid>
      <Grid item> {icon}</Grid>
    </Grid>
  );
}

export function TestAccountCheck({
  type,
  content,
}: {
  type: "success" | "warning" | "error";
  content: JSX.Element;
}): JSX.Element {
  let title: JSX.Element | null = null;
  let color: string;
  switch (type) {
    case "success":
      color = green[600];
      title = (
        <TestAccountCheckTitle
          titleString="ACCEPTED"
          color={color}
          icon={<Done style={{ color: color }} />}
        />
      );
      break;
    case "warning":
      color = yellow[600];
      title = (
        <TestAccountCheckTitle
          titleString="WARNING"
          color={color}
          icon={<Warning style={{ color: color }} />}
        />
      );
      break;
    case "error":
      color = red[600];
      title = (
        <TestAccountCheckTitle
          titleString="ERROR"
          color={color}
          icon={<Error style={{ color: color }} />}
        />
      );
      break;
  }

  return (
    <Grid item>
      <Box border={5} p={3} borderRadius={16} borderColor={color}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="center"
          direction="column"
        >
          <Grid item>{title}</Grid>
          <Grid item>{content}</Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
