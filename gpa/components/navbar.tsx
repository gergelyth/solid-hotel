import React, { useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Box,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import NotificationList from "./notification-list";

function NavigationBar(): JSX.Element {
  const additionalStyles = styles();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleNotificationClose = (
    event: React.MouseEvent<EventTarget>
  ): void => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setNotificationsOpen(false);
  };

  return (
    <AppBar className={additionalStyles.navigationBar} position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="notifications"
            ref={anchorRef}
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          >
            <Badge
              badgeContent={4}
              color="secondary"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <NotificationsActiveIcon />
            </Badge>
          </IconButton>
          <Popper
            open={isNotificationsOpen}
            anchorEl={anchorRef.current}
            transition
            disablePortal
            placement="bottom-start"
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <Box width="75%">
                  <Paper variant="outlined">
                    <ClickAwayListener onClickAway={handleNotificationClose}>
                      <NotificationList
                        isOpen={isNotificationsOpen}
                        handleClose={handleNotificationClose}
                      />
                    </ClickAwayListener>
                  </Paper>
                </Box>
              </Grow>
            )}
          </Popper>
        </Box>

        <DynamicLoginComponent />
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
