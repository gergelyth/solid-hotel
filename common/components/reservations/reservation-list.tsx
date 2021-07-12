import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { useReservations } from "../../hooks/useReservations";
import { NotEmptyItem } from "../../util/helpers";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";

function CreateReservationElement(
  reservation: ReservationAtHotel | null,
  reservationElement: (item: ReservationAtHotel) => JSX.Element
): JSX.Element {
  if (!reservation) {
    return (
      <Grid item>
        <Typography>Empty reservation.</Typography>
      </Grid>
    );
  }
  return (
    <Grid item key={reservation.id}>
      {reservationElement(reservation)}
    </Grid>
  );
}

function ReservationElements(
  reservationsUrl: string | null,
  reservationFilter: (reservation: ReservationAtHotel) => boolean,
  reservationElement: (item: ReservationAtHotel) => JSX.Element
): JSX.Element {
  const { items, isLoading, isError } = useReservations(reservationsUrl);

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

  const filteredReservations = items
    .filter(NotEmptyItem)
    .filter(reservationFilter);
  const isArrayNonEmpty = filteredReservations.length > 0;

  return isArrayNonEmpty ? (
    <Grid container spacing={1} justify="center" direction="column">
      {filteredReservations.map((item) =>
        CreateReservationElement(item, reservationElement)
      )}
    </Grid>
  ) : (
    <Box fontStyle="italic" textAlign="center">
      <Typography>No reservations found.</Typography>
    </Box>
  );
}

function ReservationList({
  reservationsUrl,
  reservationFilter,
  reservationElement,
}: {
  reservationsUrl: string | null;
  reservationFilter: (reservation: ReservationAtHotel) => boolean;
  reservationElement: (item: ReservationAtHotel) => JSX.Element;
}): JSX.Element {
  return ReservationElements(
    reservationsUrl,
    reservationFilter,
    reservationElement
  );
}

export default ReservationList;
