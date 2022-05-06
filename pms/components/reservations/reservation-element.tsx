import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ConciseHotelReservationElement from "./concise-hotel-reservation";
import { Grid } from "@material-ui/core";
import CancelReservationButton from "../../../common/components/cancellation/cancellation";
import OfflineCheckinButton from "../checkin/offline-checkin-button";
import { ReservationState } from "../../../common/types/ReservationState";
import { DoOnStateChange } from "../../util/actionOnNewReservationState";

export function ConfirmCancellation(reservation: ReservationAtHotel): void {
  if (!reservation.id) {
    throw new Error("Reservation ID is null");
  }

  if (!reservation.inbox) {
    throw new Error("Guest inbox for reservation is null");
  }

  DoOnStateChange(
    reservation.id,
    ReservationState.CANCELLED,
    reservation.inbox
  );
}

function ConfirmedReservationDetails({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={8}>
        <ConciseHotelReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
      <Grid item xs={4} container justify="flex-end" direction="row">
        <Grid item>
          <OfflineCheckinButton reservation={reservation} />
        </Grid>
        <Grid item>
          <CancelReservationButton
            reservation={reservation}
            confirmCancellation={ConfirmCancellation}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function OtherReservationDetails({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={12}>
        <ConciseHotelReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
    </Grid>
  );
}

function CreateReservationElement(
  reservation: ReservationAtHotel,
  onClickAction: ReservationClickHandler
): JSX.Element {
  if (reservation.state == ReservationState.CONFIRMED) {
    return (
      <ConfirmedReservationDetails
        reservation={reservation}
        onClickAction={onClickAction}
      />
    );
  } else {
    return (
      <OtherReservationDetails
        reservation={reservation}
        onClickAction={onClickAction}
      />
    );
  }
}

export default CreateReservationElement;
