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
          <Typography variant="body2">Hotel name, country</Typography>
          <Typography variant="body2">Street address</Typography>
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
          <Typography variant="body2">Room name</Typography>
          {/* TODO force paper to stretch to max width always */}
          <Typography variant="body2">no desc</Typography>
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
          <Typography variant="body2">Night count</Typography>
          <Typography variant="body2">Dates</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReservationDetails;
