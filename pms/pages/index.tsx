import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import LoginButtonComponent from "../../common/components/auth/login-component";
import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Property Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Property Management System</h1>
        <div className={`${styles.grid} ${styles.card}`}>
          <LoginButtonComponent />
        </div>
        <div className={`${styles.grid} ${styles.card}`}>
          <Link href="/rooms">
            <h3>Room management</h3>
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
