import Head from "next/head";
import { useRouter } from "next/router";
import ReservationList from "../../common/components/reservations/reservation-list";
import { ReservationsUrl } from "../../common/consts/solidIdentifiers";
import styles from "../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import CreateReservationElement from "../components/reservations/reservation-element";

function Reservations(): JSX.Element {
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    //todo does this work?
    router.push(`/profile/${encodeURIComponent(reservation.ownerId)}`);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Reservations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Reservations</h1>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      <ReservationList
        reservationsUrl={ReservationsUrl}
        reservationFilter={() => true}
        createReservationElement={(reservation: ReservationAtHotel | null) =>
          CreateReservationElement(reservation, OnReservationClick)
        }
      />
    </div>
  );
}

export default Reservations;
