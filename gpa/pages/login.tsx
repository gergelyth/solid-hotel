import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import dynamic from "next/dynamic";

async function SolidLogin(session: Session, oidcIssuer: string): Promise<void> {
  await session.login({
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
  });
}

const DynamicHandleRedirectComponent = dynamic(
  () => import("../components/handle-redirect-component"),
  { ssr: false }
);

function Login(): JSX.Element {
  const session = getDefaultSession();

  return (
    <div className={styles.container}>
      <DynamicHandleRedirectComponent />
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Login</h1>

      <div className={styles.grid}>
        <button
          onClick={async () => {
            SolidLogin(session, "https://inrupt.net");
          }}
        >
          Inrupt.net
        </button>
      </div>
      <div className={styles.grid}>
        <button
          onClick={async () => {
            SolidLogin(session, "https://solidcommunity.net/");
          }}
        >
          SolidCommunity.net
        </button>
      </div>
    </div>
  );
}

export default Login;
