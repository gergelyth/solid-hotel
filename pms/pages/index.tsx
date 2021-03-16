import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import { useRooms } from "../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../common/consts/solidIdentifiers";

export default function Home(): JSX.Element {
  const { items, isLoading, isError } = useRooms(RoomDefinitionsUrl);
  return (
    <div className={styles.container}>
      <Head>
        <title>Property Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Property Management System</h1>
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
