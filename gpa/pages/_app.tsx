import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// TODO https://github.com/mui-org/material-ui/blob/master/examples/nextjs/src/theme.js
import theme from "../../common/styles/theme";
import { Box, Container } from "@material-ui/core";
import NavigationBar from "../components/navbar";
import Footer from "../../common/components/footer";
import styles from "../../common/styles/styles";
import { SnackbarProvider } from "notistack";
import GlobalSnackbar from "../../common/components/snackbar";

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
        <title>Guest Portal Application</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <Container>
            <GlobalSnackbar />
            <NavigationBar />
            <Box className={additionalStyles.main}>
              <Component {...pageProps} />
            </Box>
            <Footer />
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
