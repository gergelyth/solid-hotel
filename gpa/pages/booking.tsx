import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../common/styles/Home.module.css";
import { GetCurrentDatePushedBy } from "../test/setup/populateHotelPod/withReservations";
import { ReservationState } from "../../common/types/ReservationState";
import { AddReservation, GetSession } from "../../common/util/solid";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
import RoomSelector from "../components/booking/room-selector";

enum BookingPage {
  ReservationProperties,
  //SPE page
  Success,
}

function BookRoom(roomId: string, checkinDate: Date, checkoutDate: Date): void {
  const reservation = {
    id: roomId,
    ownerId: 10,
    roomId: 0,
    state: ReservationState.CONFIRMED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  const session = GetSession();
  AddReservation(reservation, session);
  // TODO: POSTER permission not working - currently it's set to EDITOR
  AddReservationToHotelPod(reservation, session);
}

function ReservationPropertiesPage(
  currentPage: BookingPage,
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>,
  router: NextRouter
): JSX.Element {
  return (
    <div className={`${styles.simpleContainer}`}>
      <h1 className={styles.title}>Please select a room</h1>
      <RoomSelector />
      <p>==============================================</p>
      <i>Add date picker and CSS for actual room select here.</i>
      <i>
        For now it will select the first room and pick dates a few days in the
        future.
      </i>
      <button
        onClick={() => {
          BookRoom(
            "reservation100",
            GetCurrentDatePushedBy(0, 0, 5),
            GetCurrentDatePushedBy(0, 0, 10)
          );
          // setCurrentPage(currentPage + 1);
          router.push("/booking/success");
        }}
      >
        Book room
      </button>
    </div>
  );
}

function SuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <div>
      <h2>Reservation successful!</h2>
      <button onClick={() => router.push("/")}>Return to index page</button>
    </div>
  );
}

function DisplayPage(
  currentPage: BookingPage,
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>,
  router: NextRouter
): JSX.Element {
  switch (currentPage) {
    case BookingPage.ReservationProperties:
      return ReservationPropertiesPage(currentPage, setCurrentPage, router);
    case BookingPage.Success:
      return SuccessPage();
  }
}

function Booking(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    BookingPage.ReservationProperties
  );
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Book a room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {DisplayPage(currentPage, setCurrentPage, router)}
    </div>
  );
}

export default Booking;
