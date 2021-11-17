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
import { ParserList } from "../types/ParserList";
import { ShowErrorSnackbar } from "./snackbar";
import { RevalidateNotifications } from "../hooks/useNotifications";
import { SafeDeleteDataset } from "../util/solid_wrapper";

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
    //TODO for some reason this doesn't show, even though code gets here
    return <CircularProgress />;
  }

  return <Typography>{notificationRetrieval.items.length}</Typography>;
}

async function DeleteNotification(
  notification: Notification,
  podUrl: string | null,
  inboxRegexList: string[]
): Promise<void> {
  if (!notification.isProcessed) {
    ShowErrorSnackbar("Notification is not processed yet - can't be deleted.");
    return;
  }

  await SafeDeleteDataset(notification.notificationUrl);
  RevalidateNotifications(podUrl, inboxRegexList);
}

export function GetNotificationElements(
  podAddress: string | null,
  inboxRegexList: string[],
  parsers: ParserList
): { panel: JSX.Element; icon: JSX.Element } {
  const notificationRetrieval = RetrieveAllNotifications(
    podAddress,
    inboxRegexList,
    parsers
  );

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const notificationPanel = (
    <Drawer
      anchor={"left"}
      open={isNotificationsOpen}
      onClose={() => setNotificationsOpen(false)}
    >
      <NotificationList
        notificationRetrieval={notificationRetrieval}
        deleteNotification={(notification: Notification) =>
          DeleteNotification(notification, podAddress, inboxRegexList)
        }
      />
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
