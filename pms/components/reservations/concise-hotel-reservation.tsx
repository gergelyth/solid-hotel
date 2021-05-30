import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import { Grid } from "@material-ui/core";
import { Box, Typography } from "@material-ui/core";
import HotelIcon from "@material-ui/icons/Hotel";
import {
  GetNightCount,
  GetStayInterval,
} from "../../../common/components/reservations/stay-details";
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
    <Box
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        onClickAction(event, reservation)
      }
    >
      <Grid container spacing={4} alignItems="center" direction="row">
        <Grid item>
          <Box fontSize={40}>
            <HotelIcon fontSize="inherit" />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="body2">Room: {roomName}</Typography>
          <Typography variant="body2">{GetNightCount(reservation)}</Typography>
          <Typography variant="body2">
            {GetStayInterval(reservation)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConciseHotelReservationElement;
