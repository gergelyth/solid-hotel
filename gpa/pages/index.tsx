import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicLoginComponent = dynamic(
  () => import("../components/login-component"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Guest Portal Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Guest Portal Application</h1>
        <p className={styles.description}>Click on the links to navigate</p>

        <DynamicLoginComponent />

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
