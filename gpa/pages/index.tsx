import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
// import { SetField } from "../util/solid";
// import { personFieldToRdfMap } from "../vocabularies/rdf_person";
// import PopulateHotelPodWithReservations from "../test/setup/populateHotelPod/withReservations";
// import PopulateHotelPodWithRooms from "../test/setup/populateHotelPod/withRooms";

const DynamicLoginComponent = dynamic(
  () => import("../components/login-component"),
  { ssr: false }
);

// TODO: login status doesn't survive refresh
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
        {/* <button
          onClick={async () => {
            await SetField(personFieldToRdfMap.firstName, "John");
          }}
        >
          Set first name to John
        </button>
        <button
          onClick={async () => {
            await SetField(personFieldToRdfMap.firstName, "Stephen");
          }}
        >
          Set first name to Stephen
        </button>

        <button onClick={PopulateHotelPodWithReservations}>
          Populate hotel Pod with reservations (signed into HotelPod)
        </button>

        <button onClick={PopulateHotelPodWithRooms}>
          Populate hotel Pod with rooms (signed into HotelPod)
        </button> */}

        <DynamicLoginComponent />

        <div className={`${styles.grid} ${styles.card}`}>
          <Link href="/booking">
            <h3>Book a room</h3>
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
