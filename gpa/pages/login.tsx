import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { SolidLogin } from "../util/solid";

const DynamicHandleRedirectComponent = dynamic(
  () => import("../components/handle-redirect-component"),
  { ssr: false }
);

function Login(): JSX.Element {
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
