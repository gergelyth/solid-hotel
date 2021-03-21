import Head from "next/head";
import { useRouter } from "next/router";
import ReservationList from "../../common/components/reservations/reservation-list";
import styles from "../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../common/util/solid";
import CreateReservationElement from "../components/reservations/reservation-element";

function Reservations(): JSX.Element {
  const userReservationsUrl = GetUserReservationsPodUrl();
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
        reservationsUrl={userReservationsUrl}
        reservationFilter={() => true}
        createReservationElement={(reservation: ReservationAtHotel | null) =>
          CreateReservationElement(reservation, OnReservationClick)
        }
      />
    </div>
  );
}

export default Reservations;
