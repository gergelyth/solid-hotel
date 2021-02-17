import Head from "next/head";
import ReservationList from "../components/reservations/reservation-list";
import styles from "../styles/Home.module.css";

function Reservations(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reservations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Your reservations (from user Pod)</h1>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      <ReservationList reservationFilter={() => true} />
    </div>
  );
}

export default Reservations;
