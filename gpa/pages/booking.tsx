import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/Home.module.css";
import { GetCurrentDatePushedBy } from "../test/setup/populateHotelPod/withReservations";
import { ReservationState } from "../types/ReservationState";
import { AddReservation } from "../util/solid";

enum BookingPage {
  ReservationProperties,
  //SPE page
  Success,
}

const DynamicRoomSelector = dynamic(
  () => import("../components/booking/room-selector")
);

function BookRoom(roomId: string, checkinDate: Date, checkoutDate: Date): void {
  const reservation = {
    id: roomId,
    ownerId: 10,
    roomId: 0,
    state: ReservationState.CONFIRMED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  AddReservation(reservation);
}

function ReservationPropertiesPage(
  currentPage: BookingPage,
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>
): JSX.Element {
  return (
    <div>
      <DynamicRoomSelector />
      <p>==============================================</p>
      <i>Add date picker and CSS for actual room select here.</i>
      <i>
        For now it will select the first room and pick dates a few dates in the
        future.
      </i>
      <button
        onClick={() => {
          BookRoom(
            "reservation100",
            GetCurrentDatePushedBy(0, 0, 5),
            GetCurrentDatePushedBy(0, 0, 10)
          );
          setCurrentPage(currentPage + 1);
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
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>
): JSX.Element {
  switch (currentPage) {
    case BookingPage.ReservationProperties:
      return ReservationPropertiesPage(currentPage, setCurrentPage);
    case BookingPage.Success:
      return SuccessPage();
  }
}

function Booking(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    BookingPage.ReservationProperties
  );
  return (
    <div className={styles.container}>
      <Head>
        <title>Book a room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {DisplayPage(currentPage, setCurrentPage)}
    </div>
  );
}

export default Booking;
