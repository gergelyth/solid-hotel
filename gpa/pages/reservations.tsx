import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../common/types/ReservationState";
import ReservationStatusList from "../../common/components/reservations/reservation-status-list";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { useRouter } from "next/router";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import ReservationConciseElement from "../../common/components/reservations/reservation-concise-element";
import { HotelDetailsOneLiner } from "../../common/components/reservations/hotel-details";

function OnReservationClick(
  event: React.MouseEvent<HTMLElement>,
  reservation: ReservationAtHotel
): void {
  const router = useRouter();

  if (!reservation.id) {
    ShowErrorSnackbar("Reservation ID is null");
    return;
  }
  router.push(`/reservations/${encodeURIComponent(reservation.id)}`);
}

function CreateReservationElement(item: ReservationAtHotel): JSX.Element {
  return (
    <ReservationConciseElement
      reservation={item}
      titleElement={<HotelDetailsOneLiner hotelWebId={item.hotel} />}
      onClickAction={OnReservationClick}
    />
  );
}

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
          reservationsUrl={userReservationsUrl}
          reservationState={ReservationState.ACTIVE}
          reservationsTitle="Active reservations"
          createReservationElement={CreateReservationElement}
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={userReservationsUrl}
          reservationState={ReservationState.REQUESTED}
          reservationsTitle="Requested reservations"
          createReservationElement={CreateReservationElement}
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={userReservationsUrl}
          reservationState={ReservationState.CONFIRMED}
          reservationsTitle="Confirmed upcoming reservations"
          createReservationElement={CreateReservationElement}
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={userReservationsUrl}
          reservationState={ReservationState.PAST || ReservationState.CANCELLED}
          reservationsTitle="Past and cancelled reservations"
          createReservationElement={CreateReservationElement}
        />
      </Grid>
    </Grid>
  );
}

export default Reservations;
