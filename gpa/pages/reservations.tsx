import Head from "next/head";
import { useRouter } from "next/router";
import ReservationList from "../components/reservations/reservation-list";
import styles from "../styles/Home.module.css";
import { ReservationAtHotel } from "../types/ReservationAtHotel";

function Reservations(): JSX.Element {
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    router.push(`/reservations/${encodeURIComponent(reservation.id)}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Reservations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Your reservations (from user Pod)</h1>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      <ReservationList
        reservationFilter={() => true}
        onClickAction={OnReservationClick}
      />
    </div>
  );
}

export default Reservations;
