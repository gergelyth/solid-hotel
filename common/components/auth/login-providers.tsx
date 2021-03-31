import { SolidLogin } from "../../util/solid";
import { DynamicHandleRedirectComponent } from "./dynamic-handle-redirect-component";
import { Button, Container, Grid, Typography } from "@material-ui/core";

function LoginProviders(): JSX.Element {
  return (
    <Container maxWidth="sm">
      <DynamicHandleRedirectComponent />

      <h1>
        <Typography>Login</Typography>
      </h1>

      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              SolidLogin("https://inrupt.net");
            }}
          >
            Inrupt.net
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              SolidLogin("https://solidcommunity.net/");
            }}
          >
            SolidCommunity.net
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginProviders;
