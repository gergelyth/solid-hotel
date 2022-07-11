import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Box } from "@material-ui/core";
import styles from "../../common/styles/styles";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { GPAInboxList } from "../consts/inboxList";
import { GetPodOfSession } from "../../common/util/solid";
import { GetNotificationElements } from "../../common/components/notification-elements";
import { GPAParsers } from "../consts/parsers";
import {
  handleIncomingRedirect,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";
import { useRouter } from "next/router";

/**
 * The navigation bar displayed at the top of the GPA page.
 * As this component is ubiqutious, it handles the session restore capability of the Solid login functionality and contains the login/logout button as well.
 * Also contains the notification element, which display how many notifications the user has as well as opens the drawer which enables the user to view them.
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

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const notificationElements = GetNotificationElements(
    GetPodOfSession(),
    GPAInboxList,
    GPAParsers,
    isNotificationsOpen,
    setNotificationsOpen
  );

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
