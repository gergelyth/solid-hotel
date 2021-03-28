import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import ProfileMain from "../profile/profile-main";
import LoginButtonComponent from "../../common/components/auth/login-component";

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
        <ProfileMain />
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
