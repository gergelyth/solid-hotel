import React from "react";
import { AppBar, Toolbar, Box } from "@material-ui/core";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { GPAInboxList } from "../consts/inboxList";
import { GetPodOfSession } from "../../common/util/solid";
import { GetNotificationElements } from "../../common/components/notification-elements";
import { GPAParsers } from "../consts/parsers";

function NavigationBar(): JSX.Element {
  const notificationElements = GetNotificationElements(
    GetPodOfSession(),
    GPAInboxList,
    GPAParsers
  );

  const additionalStyles = styles();

  return (
    <Box>
      <AppBar className={additionalStyles.navigationBar} position="static">
        {notificationElements.panel}
        <Toolbar>
          <Box flexGrow={1}>{notificationElements.icon}</Box>
          <DynamicLoginComponent />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar;
