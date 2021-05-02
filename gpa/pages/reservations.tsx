import { GetUserReservationsPodUrl } from "../../common/util/solid";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../common/types/ReservationState";
import ReservationStatusList from "../components/reservations/reservation-status-list";

function Reservations(): JSX.Element {
  const userReservationsUrl = GetUserReservationsPodUrl();

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">
          <Box textAlign="center">Your reservations</Box>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption">
          <Box fontStyle="italic" textAlign="center">
            This is a list of all reservations made across various hotels.
          </Box>
          <Box fontStyle="italic" textAlign="center">
            Actionable reservations are highlighted.
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption"></Typography>
      </Grid>

      <Grid item>
        <ReservationStatusList
          userReservationsUrl={userReservationsUrl}
          reservationState={ReservationState.ACTIVE}
          reservationsTitle="Active reservations"
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          userReservationsUrl={userReservationsUrl}
          reservationState={ReservationState.REQUESTED}
          reservationsTitle="Requested reservations"
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          userReservationsUrl={userReservationsUrl}
          reservationState={ReservationState.CONFIRMED}
          reservationsTitle="Confirmed upcoming reservations"
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          userReservationsUrl={userReservationsUrl}
          reservationState={ReservationState.PAST || ReservationState.CANCELLED}
          reservationsTitle="Past and cancelled reservations"
        />
      </Grid>
    </Grid>
  );
}

export default Reservations;
