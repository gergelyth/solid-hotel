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
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          await Logout();
        }}
      >
        Logout
      </Button>
      <Box>Hello {guest.firstName}!</Box>
    </Container>
  );
}

function LoginButtonComponent(): JSX.Element {
  const session = getDefaultSession();

  return session.info.isLoggedIn ? GetLogoutComponent() : GetLoginComponent();
}

export default LoginButtonComponent;
