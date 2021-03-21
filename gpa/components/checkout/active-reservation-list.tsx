import styles from "../../../common/styles/Home.module.css";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { Dispatch, SetStateAction } from "react";
import { ActiveReservationElement } from "../../pages/checkout";
import CreateReservationElement from "../reservations/reservation-element";
import { GetUserReservationsPodUrl } from "../../../common/util/solid";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ReservationList from "../../../common/components/reservations/reservation-list";

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
  const userReservationsUrl = GetUserReservationsPodUrl();

  const onReservationClickFunction = GetOnReservationClickFunction(
    selectedReservationState
  );

  return (
    <ReservationList
      reservationsUrl={userReservationsUrl}
      reservationFilter={(reservation: ReservationAtHotel) =>
        reservation.state === ReservationState.ACTIVE
      }
      createReservationElement={(reservation: ReservationAtHotel | null) =>
        CreateReservationElement(reservation, onReservationClickFunction)
      }
    />
  );
}

export default ActiveReservationList;
