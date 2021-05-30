import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Box,
  Drawer,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { Notification } from "../../common/types/Notification";
import NotificationList from "./notification-list";
import { GPAInboxList } from "../consts/inboxList";
import { RetrieveAllNotifications } from "../../common/util/notifications";
import { GetPodOfSession } from "../../common/util/solid";

function GetBadgeContent(
  notificationRetrieval:
    | {
        items: (Notification | null)[];
        isLoading: boolean;
        isError: boolean;
      }
    | undefined
): JSX.Element {
  if (!notificationRetrieval || notificationRetrieval.isError) {
    return <Typography>-</Typography>;
  }

  if (notificationRetrieval.isLoading || !notificationRetrieval.items) {
    return <CircularProgress />;
  }

  return <Typography>notificationRetrieval.items.length</Typography>;
}

function NavigationBar(): JSX.Element {
  const podAddress = GetPodOfSession();

  let notificationRetrieval;
  if (podAddress) {
    notificationRetrieval = RetrieveAllNotifications(podAddress, GPAInboxList);
  }

  const additionalStyles = styles();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <Box>
      <Drawer
        anchor={"left"}
        open={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <NotificationList notificationRetrieval={notificationRetrieval} />
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
                badgeContent={GetBadgeContent(notificationRetrieval)}
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
