import { useReservations } from "../../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../../common/util/solid";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Container,
  Paper,
  PaperProps,
} from "@material-ui/core";
import HotelIcon from "@material-ui/icons/Hotel";
import RoomIcon from "@material-ui/icons/Room";
import DateRangeIcon from "@material-ui/icons/DateRange";
import HotelDetails from "../../../common/components/reservations/hotel-details";
import RoomDetails from "../../../common/components/reservations/room-details";
import {
  GetNightCount,
  GetStayInterval,
} from "../../../common/components/reservations/stay-details";

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
    return (
      <Typography variant="body1">
        Wrong query parameter. Cannot parse.
      </Typography>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !items) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
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
          <HotelDetails hotelWebId={reservationDetail.hotel} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={4}
        alignItems="center"
        direction="row"
        component={PaperComponent}
      >
        <Grid item xs={10}>
          {/* TODO force paper to stretch to max width always */}
          <RoomDetails roomUrl={reservationDetail.room} />
        </Grid>
        <Grid item xs={2}>
          <Box fontSize={40}>
            <HotelIcon fontSize="inherit" />
          </Box>
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
