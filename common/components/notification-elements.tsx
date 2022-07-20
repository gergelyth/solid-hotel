import React, { Dispatch, SetStateAction } from "react";
import { Badge, IconButton, Drawer, Typography } from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { Notification } from "../types/Notification";
import { NotificationList } from "./notification-list";
import { RetrieveAllNotifications } from "../util/notifications";
import { ParserList } from "../types/ParserList";
import { ShowErrorSnackbar } from "./snackbar";
import { RevalidateNotifications } from "../hooks/useNotifications";
import { SafeDeleteDataset } from "../util/solidWrapper";
import { LoadingIndicator } from "./loading-indicators";

/**
 * Determines the count of notifications shown in the icon. Respects the loading and potential error operation of the notification retrieval.
 * @returns The number of notifications or a symbol if not available.
 */
function GetBadgeContent(
  notificationRetrieval:
    | {
        items: (Notification | null)[];
        isLoading: boolean;
        isError: boolean;
      }
    | undefined
): JSX.Element {
  if (!notificationRetrieval) {
    return <Typography>-</Typography>;
  }

  if (notificationRetrieval.isLoading) {
    //TODO for some reason this doesn't show, even though code gets here
    return <Typography>..</Typography>;
  }

  if (notificationRetrieval.isError || !notificationRetrieval.items) {
    return <Typography>-</Typography>;
  }

  return <Typography>{notificationRetrieval.items.length}</Typography>;
}

/**
 * Deletes the notification from the Pod if it's already processed.
 */
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

/**
 * Creates the notification panel and the notification icon triggering the panel.
 * They are in this shared function because they share a lot of the setup.
 * @returns A Drawer component containing the notification items and an IconButton displaying how many notifications there are.
 */
export function GetNotificationElements(
  podAddress: string | null,
  inboxRegexList: string[],
  parsers: ParserList,
  isNotificationsOpen: boolean,
  setNotificationsOpen: Dispatch<SetStateAction<boolean>>
): { panel: JSX.Element; icon: JSX.Element } {
  const notificationRetrieval = RetrieveAllNotifications(
    podAddress,
    inboxRegexList,
    parsers
  );

  const notificationPanel = (
    <Drawer
      anchor={"left"}
      open={isNotificationsOpen}
      onClose={() => setNotificationsOpen(false)}
    >
      {notificationRetrieval.isValidating ? (
        <LoadingIndicator swrKey={"notifications"} />
      ) : null}
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
        overlap="rectangular"
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
