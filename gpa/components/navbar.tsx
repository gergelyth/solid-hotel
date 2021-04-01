import React from "react";
import { AppBar, Toolbar, Badge, IconButton, Box } from "@material-ui/core";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";

function NavigationBar(): JSX.Element {
  const additionalStyles = styles();

  return (
    <AppBar className={additionalStyles.navigationBar} position="static">
      <Toolbar>
        <Box flexGrow={1}>
          <IconButton edge="start" color="inherit" aria-label="notifications">
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
        </Box>
        <DynamicLoginComponent />
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
