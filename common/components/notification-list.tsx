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
import {
  NotificationCreatedAtChip,
  NotificationTypeChip,
} from "./notification-chips";

function NotificationItem({
  notification,
  key,
  deleteNotification,
}: {
  notification: Notification | null;
  key: number;
  deleteNotification: (notification: Notification) => Promise<void>;
}): JSX.Element | null {
  if (!notification) {
    return null;
  }

  return (
    <Card
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        notification.onClick(event)
      }
      key={key}
      raised
    >
      <CardActionArea>
        <CardContent>
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid
              item
              xs={2}
              container
              spacing={2}
              justify="center"
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
              <Typography
                variant="body2"
                align="center"
                style={{ whiteSpace: "pre-line" }}
              >
                <Box fontSize={"85%"}>{notification.text}</Box>
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
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

function NotificationList({
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
    return <Typography>Error retrieving notifications</Typography>;
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

export default NotificationList;
