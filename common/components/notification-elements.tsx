import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Drawer,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { Notification } from "../types/Notification";
import NotificationList from "./notification-list";
import { RetrieveAllNotifications } from "../util/notifications";

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

export function GetNotificationElements(
  podAddress: string | null,
  inboxRegexList: string[]
): { panel: JSX.Element; icon: JSX.Element } {
  let notificationRetrieval;
  if (podAddress) {
    notificationRetrieval = RetrieveAllNotifications(
      podAddress,
      inboxRegexList
    );
  }

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const notificationPanel = (
    <Drawer
      anchor={"left"}
      open={isNotificationsOpen}
      onClose={() => setNotificationsOpen(false)}
    >
      <NotificationList notificationRetrieval={notificationRetrieval} />
    </Drawer>
  );

  const notificationIcon = (
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
  );

  return { panel: notificationPanel, icon: notificationIcon };
}
