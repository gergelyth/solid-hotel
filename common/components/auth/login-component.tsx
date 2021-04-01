import Link from "next/link";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { SolidLogout } from "../../util/solid";
import { useGuest } from "../../hooks/useGuest";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Typography,
} from "@material-ui/core";

function GetLoginComponent(): JSX.Element {
  return (
    <Link href="/login">
      <Button variant="contained" color="primary">
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

  const { guest, isLoading, isError } = useGuest();

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !guest) {
    return (
      <Container>
        <Typography>An error occured.</Typography>;
        <Typography>{isError}</Typography>;
      </Container>
    );
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box m={1} p={1}>
        <Typography variant="subtitle1">Hello {guest.firstName}!</Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          await Logout();
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

function LoginButtonComponent(): JSX.Element {
  const session = getDefaultSession();

  return session.info.isLoggedIn ? (
    <GetLogoutComponent />
  ) : (
    <GetLoginComponent />
  );
}

export default LoginButtonComponent;
