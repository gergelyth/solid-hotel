import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import CancelReservationButton from "../../../common/components/cancellation/cancellation";
import { CancellationsUrl } from "../../../common/consts/solidIdentifiers";
import { useReservations } from "../../../common/hooks/useReservations";
import styles from "../../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import {
  AddCancellationRequest,
  GetUserReservationsPodUrl,
  SetReservationState,
} from "../../../common/util/solid";

enum ReservationDetailPage {
  Main,
  //SPE page
  CheckinSuccess,
}

function GetReservationDetails(
  reservationId: string | undefined,
  currentReservation: ReservationAtHotel | undefined,
  setCurrentReservation: Dispatch<
    SetStateAction<ReservationAtHotel | undefined>
  >
): JSX.Element {
  const { items, isLoading, isError } = useReservations(
    GetUserReservationsPodUrl()
  );

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

function ExecuteCheckin(
  currentReservation: ReservationAtHotel | undefined
): void {
  if (!currentReservation) {
    // TODO: error handling here
    console.log("should never happen");
    return;
  }

  // TODO: do checks here if check-in is possible
  SetReservationState(currentReservation.id, ReservationState.ACTIVE);
}

function ConfirmCancellation(reservationId: string): void {
  AddCancellationRequest(reservationId, CancellationsUrl);
  SetReservationState(reservationId, ReservationState.CANCELLED);
  // TODO: cancel on the hotel side (which will be done in PMS)
}

function MainPage(
  reservationId: string | undefined,
  currentPage: ReservationDetailPage,
  setCurrentPage: Dispatch<SetStateAction<ReservationDetailPage>>,
  router: NextRouter
): JSX.Element {
  const [currentReservation, setCurrentReservation] = useState<
    ReservationAtHotel | undefined
  >();
  return (
    <div className={styles.simpleContainer}>
      {GetReservationDetails(
        reservationId,
        currentReservation,
        setCurrentReservation
      )}

      <CancelReservationButton
        reservation={currentReservation}
        confirmCancellation={ConfirmCancellation}
      />
      <button
        onClick={() => {
          ExecuteCheckin(currentReservation);
          // TODO: solve this too many hooks called, so we don't have to use the success page
          // setCurrentPage(currentPage + 1);
          router.push("/reservations/success");
        }}
      >
        Check-in
      </button>
    </div>
  );
}

function CheckinSuccessPage(router: NextRouter): JSX.Element {
  function ReturnToReservations(): void {
    router.push("/reservations");
  }

  return (
    <div className={styles.simpleContainer}>
      <h2>Check-in successful!</h2>;
      <button onClick={ReturnToReservations}>Return to reservations</button>;
    </div>
  );
}

function DisplayPage(
  router: NextRouter,
  reservationId: string | undefined,
  currentPage: ReservationDetailPage,
  setCurrentPage: Dispatch<SetStateAction<ReservationDetailPage>>
): JSX.Element {
  switch (currentPage) {
    case ReservationDetailPage.Main:
      return MainPage(reservationId, currentPage, setCurrentPage, router);
    case ReservationDetailPage.CheckinSuccess:
      return CheckinSuccessPage(router);
  }
}

function ReservationDetail(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(ReservationDetailPage.Main);

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

      {DisplayPage(router, reservationId, currentPage, setCurrentPage)}
    </div>
  );
}

export default ReservationDetail;
