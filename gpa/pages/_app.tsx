import "../styles/globals.css";
import type { AppProps } from "next/app";
import SolidSession from "../util/solid";
import { Session } from "@inrupt/solid-client-authn-browser";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const state = useState({
    session: new Session(),
  })[0];

  return (
    <SolidSession.Provider value={state}>
      <Component {...pageProps} />
    </SolidSession.Provider>
  );
}

export default MyApp;
