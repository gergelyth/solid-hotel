import styles from "../styles/Home.module.css";
import Head from "next/head";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import ReservationList, {
  ReservationClickHandler,
} from "../components/reservations/reservation-list";
import { Dispatch, SetStateAction, useState } from "react";

type ActiveReservationElement = {
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

function GetOnReservationClickFunction(
  selected: ActiveReservationElement | undefined,
  setSelected: Dispatch<SetStateAction<ActiveReservationElement | undefined>>
): ReservationClickHandler {
  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    if (selected) {
      selected.reservationElement.classList.remove(styles.selected_card);
    }
    event.currentTarget.classList.add(styles.selected_card);
    setSelected({
      reservation: reservation,
      reservationElement: event.currentTarget,
    });
  }

  return OnReservationClick;
}

function Checkout(): JSX.Element {
  const [selected, setSelected] = useState<ActiveReservationElement>();

  const onReservationClickFunction = GetOnReservationClickFunction(
    selected,
    setSelected
  );

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
        onClickAction={onReservationClickFunction}
      />
    </div>
  );
}

export default Checkout;
