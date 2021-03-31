import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import Link from "next/link";
import LoginButtonComponent from "../../common/components/auth/login-component";
import { Button } from "@material-ui/core";
import subscribe from "../profile/tracker";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Solid Profile Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Solid Profile Editor</h1>
        <div className={`${styles.grid} ${styles.card}`}>
          <LoginButtonComponent />
        </div>
        <div className={`${styles.grid} ${styles.card}`}>
          <Link href="/profile">
            <h3>Profile</h3>
          </Link>
        </div>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => subscribe("https://gergelyth.inrupt.net/profile/card")}
        >
          Subscribe
        </Button>
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
