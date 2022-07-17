import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import { ReservationConciseElement } from "../../../common/components/reservations/reservation-concise-element";
import { Box, Grid, Typography } from "@material-ui/core";
import { useSpecificRoom } from "../../../common/hooks/useRooms";

/**
 * The PMS wrapper around the reservation element described in {@link ReservationConciseElement}.
 * Retrieves the room definition for which the reservation is made and displays some basic information about it.
 * @returns A component wrapping the {@link BookingProperties} component with PMS specific actions.
 */
export function ConciseHotelReservationElement({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  const { room, isLoading, isError } = useSpecificRoom(reservation.room);

  let roomName: string;

  if (isLoading) {
    roomName = "Loading room name...";
  } else if (isError || !room) {
    roomName = "Error loading room name";
  } else {
    roomName = room.name;
  }

  return (
    <ReservationConciseElement
      reservation={reservation}
      titleElement={
        <Grid container direction="row" spacing={1}>
          <Grid item>
            <Box fontWeight="fontWeightBold">
              <Typography variant="body2">Room:</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="body2">{roomName}</Typography>
          </Grid>
        </Grid>
      }
      onClickAction={onClickAction}
    />
  );
}
