import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import SolidSession from "../util/solid";
import { useContext } from "react";
import { Session } from "@inrupt/solid-client-authn-browser";

async function CheckIfLoggedIn(session: Session): Promise<void> {
  console.log("asdf");
  await session.handleIncomingRedirect(window.location.href);
}

export default function Home() {
  const session = useContext(SolidSession).session;
  if (window) {
    CheckIfLoggedIn(session);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Guest Portal Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Guest Portal Application</h1>
        <p className={styles.description}>Click on the links to navigate</p>

        <div className={`${styles.grid} ${styles.card}`}>
          <button
            onClick={async () => {
              await CheckIfLoggedIn(session);
            }}
          >
            Check if logged in
          </button>
        </div>
        <div className={`${styles.grid} ${styles.card}`}>
          <Link href={session.info.isLoggedIn ? "/logout" : "/login"}>
            <h3>{session.info.isLoggedIn ? "Logout" : "Login"}</h3>
          </Link>
        </div>
        <div className={`${styles.grid} ${styles.card}`}>
          <Link href="/reservations">
            <h3>List all reservations</h3>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
