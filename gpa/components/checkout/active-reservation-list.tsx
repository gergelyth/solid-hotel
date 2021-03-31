import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { Dispatch, SetStateAction } from "react";
import { ActiveReservationElement } from "../../pages/checkout";
import ReservationElement from "../../../common/components/reservations/reservation-element";
import { GetUserReservationsPodUrl } from "../../../common/util/solid";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ReservationList from "../../../common/components/reservations/reservation-list";
import styles from "../../../common/styles/styles";

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
    const additionalStyle = styles();

    if (selectedReservation) {
      selectedReservation.reservationElement.classList.remove(
        additionalStyle.selectedGridItem
      );
    }
    event.currentTarget.classList.add(additionalStyle.selectedGridItem);
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
      reservationElement={(item: ReservationAtHotel) => (
        <ReservationElement
          reservation={item}
          onClickAction={onReservationClickFunction}
        />
      )}
    />
  );
}

export default ActiveReservationList;
