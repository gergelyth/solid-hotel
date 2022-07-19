import {
  Box,
  List,
  Grid,
  Button,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import { compareDesc } from "date-fns";
import { Notification } from "../types/Notification";
import { ErrorComponent } from "./error-component";
import {
  NotificationCreatedAtChip,
  NotificationTypeChip,
} from "./notification-chips";

/**
 * Creates the notification item for one given notification.
 * @returns A component with the chips for time of creation and notification type, the text of the notification and a delete button.
 */
function NotificationItem({
  notification,
  deleteNotification,
}: {
  notification: Notification | null;
  deleteNotification: (notification: Notification) => Promise<void>;
}): JSX.Element | null {
  if (!notification) {
    return null;
  }

  return (
    <Card
      data-testid="notification-card"
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        notification.onClick(event)
      }
      raised
    >
      {/* TODO if this doesnt work then consider removing the CardActionArea component only? */}
      <CardActionArea component={"div"}>
        <CardContent>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={2}
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <Grid item>
                <NotificationTypeChip notification={notification} />
              </Grid>
              <Grid item>
                <NotificationCreatedAtChip notification={notification} />
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Box fontSize={"85%"}>
                <Typography
                  variant="body2"
                  align="center"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {notification.text}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Button
                data-testid="notification-delete-button"
                variant="contained"
                color="primary"
                size="medium"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification);
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * Orders the notifications by their time of creation in descending order.
 */
function OrderNotificationsByDescending(
  first: Notification | null,
  second: Notification | null
): number {
  if (!first) {
    return 1;
  }
  if (!second) {
    return -1;
  }

  return compareDesc(first.createdAt, second.createdAt);
}

/**
 * Creates the list of notifications present in the Pod ordering them by their time of creation in descending order (i.e. newest is at the top).
 * @returns The list of notification elements.
 */
export function NotificationList({
  notificationRetrieval,
  deleteNotification,
}: {
  notificationRetrieval:
    | {
        items: (Notification | null)[];
        isLoading: boolean;
        isError: boolean;
      }
    | undefined;
  deleteNotification: (notification: Notification) => Promise<void>;
}): JSX.Element {
  if (!notificationRetrieval || notificationRetrieval.isError) {
    return <ErrorComponent />;
  }

  if (notificationRetrieval.isLoading || !notificationRetrieval.items) {
    return <CircularProgress />;
  }

  const orderedNotifications = notificationRetrieval.items.sort(
    OrderNotificationsByDescending
  );

  return (
    <List>
      {orderedNotifications.map((notification, index) => (
        <NotificationItem
          notification={notification}
          key={index}
          deleteNotification={deleteNotification}
        />
      ))}
    </List>
  );
}
