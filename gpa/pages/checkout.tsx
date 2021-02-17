import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import ReservationList from "../components/reservations/reservation-list";

export function GetActiveReservations(
  reservations: (ReservationAtHotel | null)[] | undefined
): ReservationAtHotel[] {
  if (!reservations) {
    return [];
  }

  const activeReservations: ReservationAtHotel[] = [];
  reservations.forEach((reservation) => {
    if (reservation != null && reservation.state === ReservationState.ACTIVE) {
      activeReservations.push(reservation);
    }
  });

  return activeReservations;
}

function Checkout(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Active reservations</h1>

      <ReservationList
        reservationFilter={(reservation: ReservationAtHotel) =>
          reservation.state === ReservationState.ACTIVE
        }
      />
    </div>
  );
}

export default Checkout;
