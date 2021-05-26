import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Box,
  Drawer,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import NotificationList from "./notification-list";
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

function NavigationBar(): JSX.Element {
  const notifications = GetExampleNotifications();

  const additionalStyles = styles();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <Box>
      <Drawer
        anchor={"left"}
        open={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <NotificationList notifications={notifications} />
      </Drawer>

      <AppBar className={additionalStyles.navigationBar} position="static">
        <Toolbar>
          <Box flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="notifications"
              onClick={() => setNotificationsOpen(true)}
            >
              <Badge
                badgeContent={notifications.length}
                color="secondary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
          </Box>

          <DynamicLoginComponent />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;
