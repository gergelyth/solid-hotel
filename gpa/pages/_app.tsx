import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../../common/styles/theme";
import { Box, Container } from "@material-ui/core";
import NavigationBar from "../components/navbar";
import Footer from "../../common/components/footer";
import styles from "../../common/styles/styles";
import { SnackbarProvider } from "notistack";
import {
  GlobalSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { GetSession } from "../../common/util/solid";
import { ProfileCache } from "../../common/util/tracker/profile-cache";
import { UserTrackerInitializerSnackbar } from "../util/trackerInitializer";
import GlobalSwrConfig from "../../common/components/global-swr-config";
import { LoadingIndicators } from "../../common/components/loading-indicators";

/**
 * The app (core) component of the 'gpa' application.
 * Custom additions are:
 * - the snackbar provider component to allow us to display snackbars throughout the application
 * - the GPA navigation bar
 * - the loading indicators for SWR hook validations
 * - the generic footer of the applications
 * Also contains the trigger to cache the profile field values for the guest.
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const session = GetSession();

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    if (session.info.isLoggedIn && Object.keys(ProfileCache).length === 0) {
      const initSnackbarId = "initSnackbarId";
      ShowCustomSnackbar(
        () => <UserTrackerInitializerSnackbar snackbarId={initSnackbarId} />,
        initSnackbarId
      );
    }
  }, [session.info.isLoggedIn]);

  const additionalStyles = styles();

  return (
    <React.Fragment>
      <Head>
        <title>Guest Portal Application</title>
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
