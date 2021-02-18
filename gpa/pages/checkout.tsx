import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { useState } from "react";
import ActiveReservationList from "../components/checkout/active-reservation-list";
import CheckoutButton from "../components/checkout/checkout-button";

export type ActiveReservationElement = {
  reservation: ReservationAtHotel;
  reservationElement: HTMLElement;
};

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
  const [
    selectedReservation,
    setSelectedReservation,
  ] = useState<ActiveReservationElement>();

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Active reservations</h1>
      <ActiveReservationList
        selectedReservation={selectedReservation}
        setSelectedReservation={setSelectedReservation}
      />
      <CheckoutButton reservationId={selectedReservation?.reservation.id} />
    </div>
  );
}

export default Checkout;
