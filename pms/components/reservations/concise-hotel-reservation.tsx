import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import { ReservationConciseElement } from "../../../common/components/reservations/reservation-concise-element";
import { Box, Grid, Typography } from "@material-ui/core";
import { useSpecificRoom } from "../../../common/hooks/useRooms";

function ConciseHotelReservationElement({
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
            <Typography variant="body2">
              <Box fontWeight="fontWeightBold">Room:</Box>
            </Typography>
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

export default ConciseHotelReservationElement;
