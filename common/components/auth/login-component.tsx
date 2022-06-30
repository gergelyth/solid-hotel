import Link from "next/link";
import {
  getDefaultSession,
  handleIncomingRedirect,
  onLogin,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";
import { SolidLogout } from "../../util/solid";
import { Button } from "@material-ui/core";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CloseSnackbar, ShowSuccessSnackbar } from "../snackbar";

export const NotLoggedInSnackbarKey = "NotLoggedInSnackbar";

function LoginComponent(): JSX.Element {
  return (
    <Link href="/login">
      <Button variant="contained" color="primary" data-testid="login-button">
        Login
      </Button>
    </Link>
  );
}

function LogoutComponent(): JSX.Element {
  async function Logout(): Promise<void> {
    await SolidLogout();
    window.location.reload();
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        await Logout();
      }}
      data-testid="logout-button"
    >
      Logout
    </Button>
  );
}

/**
 * A component handling re-authentication on session restore and login/logout functionality.
 * @returns Login button if user is not logged in, a logout button if they are.
 */
function LoginButtonComponent(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    onSessionRestore((url) => {
      CloseSnackbar(NotLoggedInSnackbarKey);
      ShowSuccessSnackbar("User session successfully restored!");
      router.push(url);
    });

    onLogin(() => {
      CloseSnackbar(NotLoggedInSnackbarKey);
      ShowSuccessSnackbar("User logged in!");
    });

    handleIncomingRedirect({
      restorePreviousSession: true,
    });
  }, []);

  const session = getDefaultSession();
  return session.info.isLoggedIn ? <LogoutComponent /> : <LoginComponent />;
}

export default LoginButtonComponent;
