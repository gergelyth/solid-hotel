import React from "react";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// TODO https://github.com/mui-org/material-ui/blob/master/examples/nextjs/src/theme.js
import theme from "../../common/styles/theme";
import GlobalSnackbar from "../../common/components/snackbar";
import GlobalSwrConfig from "../../common/components/global-swr-config";
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

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
        <SnackbarProvider maxSnack={3}>
          <GlobalSwrConfig>
            <CssBaseline />
            <GlobalSnackbar />
            <Component {...pageProps} />
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
