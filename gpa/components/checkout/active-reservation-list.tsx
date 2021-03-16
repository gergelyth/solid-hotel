import styles from "../../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import ReservationList, {
  ReservationClickHandler,
} from "../reservations/reservation-list";
import { Dispatch, SetStateAction } from "react";
import { ActiveReservationElement } from "../../pages/checkout";

type SelectedReservationState = {
  selectedReservation: ActiveReservationElement | undefined;
  setSelectedReservation: Dispatch<
    SetStateAction<ActiveReservationElement | undefined>
  >;
};

function GetOnReservationClickFunction({
  selectedReservation,
  setSelectedReservation,
}: SelectedReservationState): ReservationClickHandler {
  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    if (selectedReservation) {
      selectedReservation.reservationElement.classList.remove(
        styles.selected_card
      );
    }
    event.currentTarget.classList.add(styles.selected_card);
    setSelectedReservation({
      reservation: reservation,
      reservationElement: event.currentTarget,
    });
  }

  return OnReservationClick;
}

function ActiveReservationList(
  selectedReservationState: SelectedReservationState
): JSX.Element {
  const onReservationClickFunction = GetOnReservationClickFunction(
    selectedReservationState
  );

  return (
    <ReservationList
      reservationFilter={(reservation: ReservationAtHotel) =>
        reservation.state === ReservationState.ACTIVE
      }
      onClickAction={onReservationClickFunction}
    />
  );
}

export default ActiveReservationList;
