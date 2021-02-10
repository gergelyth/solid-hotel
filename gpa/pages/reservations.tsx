import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const DynamicReservationList = dynamic(
  () => import("../components/reservations/reservation-list"),
  { ssr: false }
);

function Reservations(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reservations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicReservationList />
    </div>
  );
}

export default Reservations;
