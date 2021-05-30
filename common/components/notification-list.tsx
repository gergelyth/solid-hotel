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
import { Notification } from "../types/Notification";

function NotificationItem({
  notification,
  key,
}: {
  notification: Notification | null;
  key: number;
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
    >
      <CardActionArea>
        <CardContent>
          <Grid container spacing={4} justify="center" alignItems="center">
            <Grid item xs={8}>
              <Typography variant="caption">{notification.text}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" size="medium">
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function NotificationList({
  notificationRetrieval,
}: {
  notificationRetrieval:
    | {
        items: (Notification | null)[];
        isLoading: boolean;
        isError: boolean;
      }
    | undefined;
}): JSX.Element {
  if (!notificationRetrieval || notificationRetrieval.isError) {
    return <Typography>Error retrieving notifications</Typography>;
  }

  if (notificationRetrieval.isLoading || !notificationRetrieval.items) {
    return <CircularProgress />;
  }

  return (
    <List>
      {notificationRetrieval.items.map((notification, index) => (
        <NotificationItem notification={notification} key={index} />
      ))}
    </List>
  );
}

export default NotificationList;
