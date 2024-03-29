import { SolidLogin } from "../../util/solid";
import { DynamicHandleRedirectComponent } from "./dynamic-handle-redirect-component";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";

/**
 * Some basic checks, nothing too serious.
 */
function IsValidHttpUrl(input: string): boolean {
  let url;

  try {
    url = new URL(input);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Allows the selection of a Solid Pod provider - does some basic verification of the custom provider if inputted.
 * @returns A component which lets the user either choose a pre-defined Solid provider or connect to a custom one they input.
 */
function LoginProviders(): JSX.Element {
  const [customProvider, setCustomProvider] = useState("");
  const [isInputValidUrl, setIsInputValidUrl] = useState(true);

  return (
    <Container maxWidth="sm">
      <DynamicHandleRedirectComponent />

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Typography variant="h4">Login</Typography>
        </Grid>

        <Grid item>
          <Typography variant="subtitle2">
            The application requires you to log in to your Solid account.
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            error={!isInputValidUrl}
            helperText={
              isInputValidUrl
                ? ""
                : "Please enter a valid URL! (with http or https prefix)"
            }
            id="custom-provider"
            data-testid="custom-provider-textfield"
            label="Your provider"
            variant="outlined"
            type="url"
            onBlur={() => setIsInputValidUrl(IsValidHttpUrl(customProvider))}
            value={customProvider}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomProvider(e.target.value)
            }
          />
        </Grid>
        <Grid item>
          <Button
            data-testid="custom-provider-button"
            variant="contained"
            color="primary"
            onClick={async () => {
              //the input is sanitized by React automatically
              if (customProvider !== "" && isInputValidUrl) {
                SolidLogin(customProvider);
              }
            }}
          >
            Login to Solid
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="subtitle2" align="center">
            Alternatively, pick an identity provider from the options below.
          </Typography>
        </Grid>
        <Grid item>
          <Box px={3}>
            <Typography variant="subtitle2" align="center">
              Note, that you will be redirected to a page where you can enter
              your Solid credentials.
            </Typography>
          </Box>
        </Grid>

        <Grid item>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Button
                data-testid="inrupt-provider-button"
                variant="contained"
                color="primary"
                onClick={async () => {
                  SolidLogin("https://inrupt.net");
                }}
              >
                Inrupt.net
              </Button>
            </Grid>
            <Grid item xs={6}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginProviders;
