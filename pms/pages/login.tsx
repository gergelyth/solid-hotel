import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import { SolidLogin } from "../../common/util/solid";
import { DynamicHandleRedirectComponent } from "../../common/components/auth/dynamic-handle-redirect-component";

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
