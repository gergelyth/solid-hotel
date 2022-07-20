import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { GPAInboxList } from "../consts/inboxList";
import { GetPodOfSession, GetSession } from "../../common/util/solid";
import { GetNotificationElements } from "../../common/components/notification-elements";
import { GPAParsers } from "../consts/parsers";
import {
  handleIncomingRedirect,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";
import { useRouter } from "next/router";
import Link from "next/link";
import { useReservations } from "../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../common/util/solidReservations";
import { ErrorComponent } from "../../common/components/error-component";
import { GetActiveReservations } from "./checkout/reservationselect-subpage";

/**
 * The check-out button which takes the user to the checkout page.
 * It's disabled if there are no active reservations for the user.
 * @returns The check-out button enabled or disabled (in case no active reservations are currently found)
 */
function CheckoutButton(): JSX.Element {
  const reservationsResult = useReservations(GetUserReservationsPodUrl());
  if (reservationsResult.isLoading) {
    return <CircularProgress />;
  }

  if (reservationsResult.isError || !reservationsResult.items) {
    return <ErrorComponent />;
  }

  const hasActiveReservation =
    GetActiveReservations(reservationsResult.items).length != 0;
  return (
    <Link href="/checkout">
      <Button
        disabled={!hasActiveReservation}
        variant="contained"
        color="primary"
      >
        Checkout
      </Button>
    </Link>
  );
}

/**
 * The navigation bar displayed at the top of the GPA page.
 * As this component is ubiqutious, it handles the session restore capability of the Solid login functionality and contains the login/logout button as well.
 * Contains links in form of button to the other pages: booking, reservations, checkout, privacy dashboard, profile editor.
 * The check-out button/link is active only if there's a currently an active reservation for the guest.
 * Also contains the notification element, which display how many notifications the user has as well as opens the drawer which enables the user to view them.
 * @returns A component including the notification display, navigation buttons as well as the login/logout trigger button.
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

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notificationElements = GetNotificationElements(
    GetPodOfSession(),
    GPAInboxList,
    GPAParsers,
    isNotificationsOpen,
    setNotificationsOpen
  );

  const isLoggedIn = GetSession().info.isLoggedIn;

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
              <Typography variant="h6">Guest Portal Application</Typography>
            </Grid>
            <Grid item xs={7} container spacing={1}>
              <Grid item>
                <Link href="/">
                  <Button variant="contained" color="primary">
                    Reservations
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/booking">
                  <Button variant="contained" color="primary">
                    Booking
                  </Button>
                </Link>
              </Grid>
              {isLoggedIn ? (
                <Grid item>
                  <CheckoutButton />
                </Grid>
              ) : null}
              <Grid item>
                <Link href="/privacy">
                  <Button variant="contained" color="primary">
                    Privacy
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/profile">
                  <Button variant="contained" color="primary">
                    Profile
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
