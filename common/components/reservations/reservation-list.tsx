import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { useReservations } from "../../hooks/useReservations";
import { NotEmptyItem } from "../../util/helpers";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import ErrorComponent from "../error-component";

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
    return <ErrorComponent />;
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
