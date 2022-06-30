import Link from "next/link";
import {
  getDefaultSession,
  handleIncomingRedirect,
  onLogin,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";
import { SolidLogout } from "../../util/solid";
import { useGuest } from "../../hooks/useGuest";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CloseSnackbar, ShowSuccessSnackbar } from "../snackbar";

export const NotLoggedInSnackbarKey = "NotLoggedInSnackbar";

function GetLoginComponent(): JSX.Element {
  return (
    <Link href="/login">
      <Button variant="contained" color="primary" data-testid="login">
        Login
      </Button>
    </Link>
  );
}

function GetLogoutComponent(): JSX.Element {
  async function Logout(): Promise<void> {
    await SolidLogout();
    //TODO for some reason it can't build because it can't find window - may just be intermittent
    window.location.reload();
  }

  //TODO
  // const { guest, isLoading, isError } = useGuest();

  // if (isLoading) {
  //   return <CircularProgress />;
  // }
  // if (isError || !guest) {
  //   return (
  //     <Container>
  //       <Typography>An error occured.</Typography>;
  //       <Typography>{isError}</Typography>;
  //     </Container>
  //   );
  // }

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box m={1} p={1}>
        {/* TODO <Typography variant="subtitle1">Hello {guest.firstName}!</Typography> */}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          await Logout();
        }}
        data-testid="logout"
      >
        Logout
      </Button>
    </Box>
  );
}

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
  return session.info.isLoggedIn ? GetLogoutComponent() : GetLoginComponent();
}

export default LoginButtonComponent;
