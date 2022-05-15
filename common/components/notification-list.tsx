import {
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
          <Grid container spacing={4} justify="center" alignItems="center">
            <Grid item>
              <Typography variant="caption" align="center">
                {/* PRE style to preserve line breaks */}
                <pre style={{ fontFamily: "inherit" }}>{notification.text}</pre>
              </Typography>
            </Grid>
            <Grid item>
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
