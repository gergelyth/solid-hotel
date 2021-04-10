import {
  MenuList,
  MenuItem,
  Grid,
  Box,
  Button,
  Typography,
  Paper,
} from "@material-ui/core";
import { Notification } from "../../common/types/Notification";

function GetExampleNotifications(): Notification[] {
  return [
    {
      text:
        "Some not ifajdhlsfj ahfjdkahf asldkfj askdfj as;lkdfjas;kfh a;sdfkjsdkfj kl;asjfiee asdf ssd ",
      onClick: () => {
        console.log("something");
      },
    },
    {
      text:
        "Another qweqweq safwer qwer qe ggg qwe qwe  gfdgfdg qer ag poipoi asf",
      onClick: () => {
        console.log("another");
      },
    },
  ];
}

function NotificationItem({
  notification,
  handleClose,
  key,
}: {
  notification: Notification;
  handleClose: (event: React.MouseEvent<EventTarget>) => void;
  key: number;
}): JSX.Element {
  return (
    <Paper elevation={6}>
      <MenuItem
        style={{ whiteSpace: "normal" }}
        key={key}
        onClick={(event) => {
          notification.onClick(event);
          handleClose(event);
        }}
      >
        <Grid
          container
          xs={12}
          spacing={4}
          justify="center"
          alignItems="center"
        >
          <Grid item xs={8}>
            <Typography variant="caption">{notification.text}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" size="small">
              Clear
            </Button>
          </Grid>
        </Grid>
      </MenuItem>
    </Paper>
  );
}

function NotificationList({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: (event: React.MouseEvent<EventTarget>) => void;
}): JSX.Element {
  const notifications = GetExampleNotifications();

  return (
    <MenuList autoFocusItem={isOpen}>
      {notifications.map((notification, index) => (
        <NotificationItem
          notification={notification}
          handleClose={handleClose}
          key={index}
        />
      ))}
    </MenuList>
  );
}

export default NotificationList;
