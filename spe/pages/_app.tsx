import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import styles from "../../common/styles/styles";
import theme from "../../common/styles/theme";
import { GlobalSnackbar } from "../../common/components/snackbar";
import GlobalSwrConfig from "../../common/components/global-swr-config";
import { SnackbarProvider } from "notistack";
import { LoadingIndicators } from "../../common/components/loading-indicators";
import { Box, Container } from "@material-ui/core";
import Footer from "../../common/components/footer";

/**
 * The app (core) component of the 'spe' application.
 * Custom additions are:
 * - the snackbar provider component to allow us to display snackbars throughout the application
 * - the loading indicators for SWR hook validations
 * - the generic footer of the applications
 * Also contains the trigger to cache the hotel profile field values for the guests with an active reservation.
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
        <title>Solid Profile Editor</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <GlobalSwrConfig>
            <Container maxWidth="md">
              <GlobalSnackbar />
              <LoadingIndicators />
              <Box className={additionalStyles.main}>
                <Component {...pageProps} />
              </Box>
              <Footer />
            </Container>
          </GlobalSwrConfig>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
