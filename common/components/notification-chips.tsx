import { Box, Typography, Chip } from "@material-ui/core";
import { format } from "date-fns";
import { Notification } from "../types/Notification";
import { NotificationType } from "../types/NotificationsType";
import {
  amber,
  blue,
  indigo,
  orange,
  purple,
  red,
} from "@material-ui/core/colors";

export function NotificationTypeChip({
  notification,
}: {
  notification: Notification;
}): JSX.Element {
  let properties: { color: string; label: string };
  switch (notification.type) {
    case NotificationType.BookingRequest:
    case NotificationType.ReservationStateChange:
      properties = { color: orange[300], label: "Reservation" };
      break;

    case NotificationType.FailureReport:
      properties = { color: red[200], label: "Failure" };
      break;

    case NotificationType.InitialPairingRequest:
    case NotificationType.PairingRequestWithInformation:
      properties = { color: amber[300], label: "Pairing" };
      break;

    case NotificationType.PrivacyToken:
    case NotificationType.PrivacyTokenDeletion:
      properties = { color: purple[300], label: "Privacy" };
      break;

    case NotificationType.ProfileModification:
      properties = { color: indigo[300], label: "Profile" };
      break;

    default:
      properties = { color: red[300], label: "Undefined" };
      break;
  }

  return (
    <Chip
      size="small"
      label={
        <Typography variant="subtitle2" align="center">
          <Box fontSize={"70%"}>{properties.label}</Box>
        </Typography>
      }
      style={{ backgroundColor: properties.color }}
    />
  );
}

export function NotificationCreatedAtChip({
  notification,
}: {
  notification: Notification;
}): JSX.Element {
  return (
    <Chip
      size="small"
      label={
        <Box p={0.5}>
          <Typography variant="subtitle2" align="center">
            <Box fontSize={"60%"}>
              {format(notification.createdAt, "yyyy-MM-dd")}
            </Box>
            <Box fontSize={"60%"}>
              {format(notification.createdAt, "HH:mm:ss")}
            </Box>
          </Typography>
        </Box>
      }
      style={{ height: "100%", backgroundColor: blue[200] }}
    />
  );
}
