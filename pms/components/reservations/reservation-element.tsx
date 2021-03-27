import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ReservationElement from "../../../common/components/reservations/reservation-element";
import { Grid } from "@material-ui/core";
import CancelReservationButton from "../../../common/components/cancellation/cancellation";
import { AddCancellationRequest } from "../../../common/util/solid";
import { CancellationsUrl } from "../../../common/consts/solidIdentifiers";
import OfflineCheckinButton from "../checkin/offline-checkin";

function ConfirmCancellation(reservationId: string): void {
  AddCancellationRequest(reservationId, CancellationsUrl);
  // SetReservationState(reservationId, ReservationState.CANCELLED);
  // TODO: cancel on the hotel side (which will be done in PMS)
}

function CreateReservationElement(
  reservation: ReservationAtHotel,
  onClickAction: ReservationClickHandler
): JSX.Element {
  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item>
        <ReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
      <Grid item>
        <OfflineCheckinButton />
      </Grid>
      <Grid item>
        <CancelReservationButton
          reservation={reservation}
          confirmCancellation={ConfirmCancellation}
        />
      </Grid>
    </Grid>
  );
}

export default CreateReservationElement;