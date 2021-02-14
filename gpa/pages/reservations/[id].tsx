import Head from "next/head";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import CancelReservationButton from "../../components/cancellation/cancellation";
import { useUserReservations } from "../../hooks/useUserReservations";
import styles from "../../styles/Home.module.css";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";

function GetReservationDetails(
  reservationId: string | undefined,
  currentReservation: ReservationAtHotel | undefined,
  setCurrentReservation: Dispatch<
    SetStateAction<ReservationAtHotel | undefined>
  >
): JSX.Element {
  const { items, isLoading, isError } = useUserReservations();

  if (!reservationId) {
    return <div>Wrong query parameter: {reservationId}. Cannot parse.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !items) {
    return <div>Fetching the reservations failed.</div>;
  }

  const reservationDetail = items.find(
    (reservation) => reservation?.id === reservationId
  );

  if (!reservationDetail) {
    return <div>Reservation ID not found in reservation list.</div>;
  }

  if (!currentReservation) {
    setCurrentReservation(reservationDetail);
  }

  return (
    <div className={styles.simpleContainer}>
      <h3>Hotel WebId here</h3>
      <div>Room: {reservationDetail.roomId}</div>
      <div>State: {ReservationState[reservationDetail.state]}</div>
      <div>Check-in date: {reservationDetail.dateFrom.toDateString()}</div>
      <div>Check-out date: {reservationDetail.dateTo.toDateString()}</div>
    </div>
  );
}

function ReservationDetail(): JSX.Element {
  const [currentReservation, setCurrentReservation] = useState<
    ReservationAtHotel | undefined
  >();

  const router = useRouter();
  let reservationId = router.query.id;
  if (Array.isArray(reservationId)) {
    reservationId = reservationId[0];
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Reservation detail</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>Reservation details</h2>

      {GetReservationDetails(
        reservationId,
        currentReservation,
        setCurrentReservation
      )}

      <CancelReservationButton reservation={currentReservation} />
    </div>
  );
}

export default ReservationDetail;
