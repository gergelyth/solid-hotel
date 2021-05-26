import {
  List,
  Grid,
  Button,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { Notification } from "../../common/types/Notification";

function NotificationItem({
  notification,
  key,
}: {
  notification: Notification;
  key: number;
}): JSX.Element {
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
  notifications,
}: {
  notifications: Notification[];
}): JSX.Element {
  return (
    <List>
      {notifications.map((notification, index) => (
        <NotificationItem notification={notification} key={index} />
      ))}
    </List>
  );
}

export default NotificationList;
