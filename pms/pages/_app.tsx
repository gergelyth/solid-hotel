import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box, Container } from "@material-ui/core";
import theme from "../../common/styles/theme";
import styles from "../../common/styles/styles";
import Footer from "../../common/components/footer";
import NavigationBar from "../components/navbar";
import { SnackbarProvider } from "notistack";
import { GlobalSnackbar } from "../../common/components/snackbar";
import { ProfileCache } from "../../common/util/tracker/profile-cache";
import { CacheHotelProfiles } from "../util/trackerInitializer";
import { GetSession } from "../../common/util/solid";
import GlobalSwrConfig from "../../common/components/global-swr-config";
import { LoadingIndicators } from "../../common/components/loading-indicators";

/**
 * The app (core) component of the 'pms' application.
 * Custom additions are:
 * - the snackbar provider component to allow us to display snackbars throughout the application
 * - the PMS navigation bar
 * - the loading indicators for SWR hook validations
 * - the generic footer of the applications
 * Also contains the trigger to cache the hotel profile field values for the guests with an active reservation.
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const session = GetSession();

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    if (session.info.isLoggedIn && Object.keys(ProfileCache).length === 0) {
      CacheHotelProfiles();
    }
  }, [session.info.isLoggedIn]);

  const additionalStyles = styles();

  return (
    <React.Fragment>
      <Head>
        <title>Property Management System</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <GlobalSwrConfig>
            <Container>
              <GlobalSnackbar />
              <NavigationBar />
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
