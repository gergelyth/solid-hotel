import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../styles/theme";
import { Box, Container } from "@material-ui/core";
import styles from "../styles/styles";
import { SnackbarProvider } from "notistack";
import { GlobalSnackbar } from "../components/snackbar";

/**
 * The app (core) component of the 'common' application.
 * Custom additions are:
 * - the snackbar provider component to allow us to display snackbars throughout the application
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const additionalStyles = styles();

  return (
    <React.Fragment>
      <Head>
        <title>Setup</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Container maxWidth="sm">
            <GlobalSnackbar />
            <Box className={additionalStyles.main}>
              <Component {...pageProps} />
            </Box>
          </Container>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
