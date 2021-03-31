import { Button, Container, Grid, Typography } from "@material-ui/core";
import LoginButtonComponent from "../../common/components/auth/login-component";
import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <Container maxWidth="sm">
      <main>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <h1>
              <Typography>Property Management System</Typography>
            </h1>
          </Grid>
          <Grid item>
            <Typography>Click on the links to navigate</Typography>
          </Grid>
          <Grid item>
            <LoginButtonComponent />
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
        </Grid>
      </main>

      <footer>
        <Typography>MIT License</Typography>
      </footer>
    </Container>
  );
}
