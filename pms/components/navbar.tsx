import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { PMSInboxList } from "../consts/inboxList";
import { GetPodOfSession } from "../../common/util/solid";
import { GetNotificationElements } from "../../common/components/notification-elements";
import Link from "next/link";
import { PMSParsers } from "../consts/parsers";
import {
  handleIncomingRedirect,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";
import { useRouter } from "next/router";

/**
 * The navigation bar displayed at the top of the PMS page.
 * As this component is ubiqutious, it handles the session restore capability of the Solid login functionality and contains the login/logout button as well.
 * Also contains the notification element, which display how many notifications the user has as well as opens the drawer which enables the user to view them.
 * Contains links in form of buttons to the other pages: rooms, booking, reservations, privacy dashboard.
 * @returns A component including the notification display and logic as well as the login/logout trigger button.
 */
function NavigationBar(): JSX.Element {
  const router = useRouter();

  onSessionRestore((url) => {
    router.push(url);
  });

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true,
    });
  }, []);

  const additionalStyles = styles();

  const podAddress = GetPodOfSession();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notificationElements = GetNotificationElements(
    podAddress,
    PMSInboxList,
    PMSParsers,
    isNotificationsOpen,
    setNotificationsOpen
  );

  return (
    <Box>
      <AppBar className={additionalStyles.navigationBar} position="static">
        {notificationElements.panel}
        <Toolbar>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
              {notificationElements.icon}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Property Management System</Typography>
            </Grid>
            <Grid item xs={7} container spacing={1}>
              <Grid item>
                <Link href="/rooms">
                  <Button variant="contained" color="primary">
                    Room management
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/booking">
                  <Button variant="contained" color="primary">
                    Book room
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/reservations">
                  <Button variant="contained" color="primary">
                    Reservations
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/privacy">
                  <Button variant="contained" color="primary">
                    Privacy dashboard
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <DynamicLoginComponent />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;
