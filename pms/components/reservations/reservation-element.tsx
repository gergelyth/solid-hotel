import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ConciseHotelReservationElement from "./concise-hotel-reservation";
import { Grid } from "@material-ui/core";
import CancelReservationButton from "../../../common/components/cancellation/cancellation";
import OfflineCheckinButton from "../checkin/offline-checkin";

function CreateReservationElement(
  reservation: ReservationAtHotel,
  onClickAction: ReservationClickHandler
): JSX.Element {
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
      <Grid item xs={2}>
        <OfflineCheckinButton />
      </Grid>
      <Grid item xs={2}>
        <CancelReservationButton
          reservation={reservation}
          confirmCancellation={ConfirmCancellation}
        />
      </Grid>
    </Grid>
  );
}

export default CreateReservationElement;
