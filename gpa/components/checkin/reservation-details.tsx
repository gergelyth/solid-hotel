import { useReservations } from "../../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../../common/util/solid_reservations";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  PaperProps,
} from "@material-ui/core";
import HotelIcon from "@material-ui/icons/Hotel";
import RoomIcon from "@material-ui/icons/Room";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { HotelDetailsTwoLiner } from "../../../common/components/reservations/hotel-details";
import { RoomDetails } from "../../../common/components/reservations/room-details";
import {
  GetNightCount,
  GetStayInterval,
} from "../../../common/components/reservations/stay-details";
import { ErrorComponent } from "../../../common/components/error-component";
import { ShowError } from "../../../common/util/helpers";

/**
 * Displays detailed information about a reservation.
 * The reservation is fetched from the Solid Pod and parsed afterwards.
 * @returns A component containing details of the hotel, of the room and information about the dates the stay is booked for.
 */
function ReservationDetails({
  reservationId,
  setCurrentReservation,
}: {
  reservationId: string | undefined;
  setCurrentReservation: (reservation: ReservationAtHotel | undefined) => void;
}): JSX.Element {
  const { items, isLoading, isError } = useReservations(
    GetUserReservationsPodUrl()
  );

  if (!reservationId) {
    ShowError(
      "Query parameter [reservationId] not found. Cannot parse reservation.",
      true
    );
    return <ErrorComponent />;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !items) {
    return <ErrorComponent />;
  }

  const reservationDetail = items.find(
    (reservation) => reservation?.id === reservationId
  );

  if (!reservationDetail) {
    return (
      <Typography variant="body1">
        Reservation ID not found in reservation list.
      </Typography>
    );
  }

  setCurrentReservation(reservationDetail);

  const PaperComponent = (props: PaperProps): JSX.Element => (
    <Box width="100%" margin={2} padding={2}>
      <Paper elevation={3} {...props} />
    </Box>
  );

  return (
    <Box>
      <Grid
        container
        spacing={4}
        alignItems="center"
        direction="row"
        component={PaperComponent}
      >
        <Grid item xs={2}>
          <Box fontSize={40}>
            <RoomIcon fontSize="inherit" />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <HotelDetailsTwoLiner hotelWebId={reservationDetail.hotel} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        alignItems="center"
        direction="row"
        component={PaperComponent}
      >
        <Grid item xs={2}>
          <Box fontSize={40}>
            <HotelIcon fontSize="inherit" />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <RoomDetails roomUrl={reservationDetail.room} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        alignItems="center"
        direction="row"
        component={PaperComponent}
      >
        <Grid item xs={2}>
          <Box fontSize={40}>
            <DateRangeIcon fontSize="inherit" />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body2">
            {GetNightCount(reservationDetail)}
          </Typography>
          <Typography variant="body2">
            {GetStayInterval(reservationDetail)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReservationDetails;
