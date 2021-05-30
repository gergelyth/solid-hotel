import React from "react";
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
import HouseIcon from "@material-ui/icons/House";
import Link from "next/link";

function NavigationBar(): JSX.Element {
  const podAddress = GetPodOfSession();
  const notificationElements = GetNotificationElements(
    podAddress,
    PMSInboxList
  );

  const additionalStyles = styles();

  return (
    <Box>
      <AppBar className={additionalStyles.navigationBar} position="static">
        {notificationElements.panel}
        <Toolbar>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <HouseIcon />
            </Grid>
            <Grid item>
              <Typography variant="h6">Property Management System</Typography>
            </Grid>
            <Grid item>
              <Link href="/rooms">
                <Button variant="contained" color="primary">
                  Room management
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
            <Grid item>{notificationElements.icon}</Grid>
            <Grid item>
              <DynamicLoginComponent />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;
