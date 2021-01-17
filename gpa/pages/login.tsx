import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = getDefaultSession();
  await session.login({
    oidcIssuer: oidcIssuer,
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
            SolidLogin("https://inrupt.net");
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
