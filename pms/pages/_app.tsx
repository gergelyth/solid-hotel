import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// TODO https://github.com/mui-org/material-ui/blob/master/examples/nextjs/src/theme.js
import { Box, Container } from "@material-ui/core";
import theme from "../../common/styles/theme";
import styles from "../../common/styles/styles";
import Footer from "../../common/components/footer";
import NavigationBar from "../components/navbar";
import { SnackbarProvider } from "notistack";
import GlobalSnackbar from "../../common/components/snackbar";
import { ProfileCache } from "../../common/util/tracker/profileCache";
import { CacheHotelProfiles } from "../util/trackerInitializer";
import { GetSession } from "../../common/util/solid";
import { SWRConfig } from "swr";
import { OnHookErrorFunction } from "../../common/util/helpers";

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
          <SWRConfig
            value={{
              onError: OnHookErrorFunction,
            }}
          >
            <Container>
              <GlobalSnackbar />
              <NavigationBar />
              <Box className={additionalStyles.main}>
                <Component {...pageProps} />
              </Box>
              <Footer />
            </Container>
          </SWRConfig>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
