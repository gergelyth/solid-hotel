import { ReservationList } from "./reservation-list";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../types/ReservationState";

/**
 * Returns a list of reservations retrieved from the URL passed to the component.
 * The type of reservation elements created can be customized.
 * A filter is supplied to filter the reservations based on their state (confirmed, active, etc.).
 * @returns A list of reservation elements or a simple string informing the user that no reservations are found (or match the filter).
 */
export function ReservationStatusList({
  reservationsUrl,
  reservationFilter,
  reservationsTitle,
  createReservationElement,
}: {
  reservationsUrl: string | null;
  reservationFilter: (state: ReservationState) => boolean;
  reservationsTitle: string;
  createReservationElement: (reservation: ReservationAtHotel) => JSX.Element;
}): JSX.Element {
  return (
    <Box>
      <Grid item>
        <Box px={2} fontWeight="fontWeightBold">
          <Typography variant="body1">{reservationsTitle}</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box px={2}>
          <ReservationList
            reservationsUrl={reservationsUrl}
            reservationFilter={(reservation) =>
              reservationFilter(reservation.state)
            }
            reservationElement={createReservationElement}
          />
        </Box>
      </Grid>
    </Box>
  );
}
