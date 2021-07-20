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
