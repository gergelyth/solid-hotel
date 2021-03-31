import { Button, Container, Grid, Typography } from "@material-ui/core";
import Link from "next/link";
import LoginButtonComponent from "../../common/components/auth/login-component";
import subscribe from "../profile/tracker";

export default function Home() {
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
              <Typography>Solid Profile Editor</Typography>
            </h1>
          </Grid>
          <Grid item>
            <LoginButtonComponent />
          </Grid>

          <Grid item>
            <Link href="/profile">
              <Button variant="contained" color="primary">
                Profile
              </Button>
            </Link>
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              subscribe("https://gergelyth.inrupt.net/profile/card")
            }
          >
            Subscribe
          </Button>
        </Grid>
      </main>

      <footer>
        <Typography>MIT License</Typography>
      </footer>
    </Container>
  );
}
