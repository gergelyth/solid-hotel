import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
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

class Booking extends React.Component<unknown, { currentPage: BookingPage }> {
  constructor(props: unknown) {
    super(props);
    this.state = { currentPage: BookingPage.ReservationProperties };
  }

  BookRoom(roomId: string, checkinDate: Date, checkoutDate: Date): void {
    const reservation = {
      id: roomId,
      ownerId: 10,
      roomId: 0,
      state: ReservationState.CONFIRMED,
      dateFrom: checkinDate,
      dateTo: checkoutDate,
    };

    AddReservation(reservation);
    this.setState({ currentPage: BookingPage.Success });
  }

  ReservationPropertiesPage(): JSX.Element {
    return (
      <div>
        <DynamicRoomSelector />
        <p>==============================================</p>
        <i>Add date picker and CSS for actual room select here.</i>
        <i>
          For now it will select the first room and pick dates a few dates in
          the future.
        </i>
        <button
          onClick={() => {
            this.BookRoom(
              "reservation100",
              GetCurrentDatePushedBy(0, 0, 5),
              GetCurrentDatePushedBy(0, 0, 10)
            );
          }}
        >
          Book room
        </button>
      </div>
    );
  }

  SuccessPage(): JSX.Element {
    return <h2>Reservation successful!</h2>;
  }

  DisplayPage(): JSX.Element {
    switch (this.state.currentPage) {
      case BookingPage.ReservationProperties:
        return this.ReservationPropertiesPage();
      case BookingPage.Success:
        return this.SuccessPage();
    }
  }

  render(): JSX.Element {
    return (
      <div className={styles.container}>
        <Head>
          <title>Book a room</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {this.DisplayPage()}
      </div>
    );
  }
}

export default Booking;
