import { Session } from "@inrupt/solid-client-authn-browser";
import Head from "next/head";
import styles from "../styles/Home.module.css";

async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = new Session();
  await session.login({
    // Specify the URL of the user's Solid Identity Provider; e.g., "https://inrupt.net"
    oidcIssuer: oidcIssuer,
    // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
    // e.g., the current page for a single-page app.
    redirectUrl: window.location.origin,
  });
}

function Login(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Login</h1>

      <div className={styles.grid}>
        <button
          onClick={async () => {
            await SolidLogin("https://inrupt.net");
          }}
        >
          Inrupt.net
        </button>
      </div>
      <div className={styles.grid}>
        <button
          onClick={async () => {
            SolidLogin("https://solidcommunity.net/");
          }}
        >
          SolidCommunity.net
        </button>
      </div>
    </div>
  );
}

export default Login;
