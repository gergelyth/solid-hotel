import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { useReservations } from "../../hooks/useReservations";
import { NotEmptyItem } from "../../util/helpers";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { ErrorComponent } from "../error-component";

/**
 * A helper component which wraps the reservation element into a Grid element making the layout nicer.
 * @returns The reservation component wrapped in a Grid child element.
 */
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

/**
 * Retrieves the reservations from the URL provided, filters them and creates the reservation elements.
 * @returns A list of reservation elements or a simple string informing the user that no reservations are found (or match the filter).
 */
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
    <Grid container spacing={1} justifyContent="center" direction="column">
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

/**
 * Returns a list of reservations retrieved from the URL passed to the component.
 * The type of reservation elements created can be customized.
 * A filter can also be supplied to show only reservations matching specific criteria (we filter out empty reservations without prompt).
 * @returns A list of reservation elements or a simple string informing the user that no reservations are found (or match the filter).
 */
export function ReservationList({
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
