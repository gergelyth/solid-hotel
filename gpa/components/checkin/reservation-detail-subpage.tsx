import { Dispatch, SetStateAction, useState } from "react";
import { CancelReservationButton } from "../../../common/components/cancellation/cancellation";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { Grid, Button } from "@material-ui/core";
import { CheckinPage } from "../../pages/reservations/[id]";
import ReservationDetails from "./reservation-details";
import {
  SubmitCancellationRequest,
  SubmitCheckinRequest,
} from "../../util/outgoingCommunications";

/**
 * Submits the check-in request to the hotel Pod.
 */
function ExecuteCheckin(
  currentReservation: ReservationAtHotel | undefined
): void {
  if (!currentReservation) {
    // TODO: error handling here
    console.log("should never happen");
    return;
  }

  // TODO: do checks here if check-in is possible
  SubmitCheckinRequest(currentReservation);
}

/**
 * Submit the cancellation request to the hotel Pod.
 */
function ConfirmCancellation(reservation: ReservationAtHotel): void {
  SubmitCancellationRequest(reservation);
}

/**
 * The component displayed when a specific reservation is opened and is in focus.
 * @returns A component displaying information about the reservation, the cancel button and a check-in button.
 */
function ReservationDetailsPage({
  reservationId,
  setExecuteCheckin,
  currentPage,
  setCurrentPage,
}: {
  reservationId: string | undefined;
  setExecuteCheckin: Dispatch<SetStateAction<() => () => void>>;
  currentPage: CheckinPage;
  setCurrentPage: Dispatch<SetStateAction<CheckinPage>>;
}): JSX.Element | null {
  const [currentReservation, setCurrentReservation] = useState<
    ReservationAtHotel | undefined
  >();

  if (currentPage !== CheckinPage.ReservationDetail) {
    return null;
  }

  return (
    <Grid
      container
      spacing={5}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <ReservationDetails
          reservationId={reservationId}
          setCurrentReservation={(
            reservation: ReservationAtHotel | undefined
          ) => {
            if (!currentReservation) {
              setCurrentReservation(reservation);
            }
          }}
        />
      </Grid>

      <Grid item>
        <CancelReservationButton
          reservation={currentReservation}
          confirmCancellation={ConfirmCancellation}
        />
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          disabled={!currentReservation}
          onClick={() => {
            setExecuteCheckin(() => () => {
              ExecuteCheckin(currentReservation);
            });
            setCurrentPage(currentPage + 1);
          }}
        >
          Check-in
        </Button>
      </Grid>
    </Grid>
  );
}

export default ReservationDetailsPage;
