import ReservationList from "./reservation-list";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../types/ReservationState";

function ReservationStatusList({
  reservationsUrl,
  reservationState,
  reservationsTitle,
  createReservationElement,
}: {
  reservationsUrl: string | null;
  reservationState: ReservationState;
  reservationsTitle: string;
  createReservationElement: (reservation: ReservationAtHotel) => JSX.Element;
}): JSX.Element {
  return (
    <Box>
      <Grid item>
        <Typography variant="body1">
          <Box px={2} fontWeight="fontWeightBold">
            {reservationsTitle}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box px={2}>
          <ReservationList
            reservationsUrl={reservationsUrl}
            reservationFilter={(reservation: ReservationAtHotel) => {
              return reservation.state === reservationState;
            }}
            reservationElement={createReservationElement}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default ReservationStatusList;
