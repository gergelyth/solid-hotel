import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import { Button, Container, Typography } from "@material-ui/core";

function ReservationElement({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Button
      variant="outlined"
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        onClickAction(event, reservation)
      }
    >
      <Container maxWidth="sm">
        <Typography>Owner: {reservation.owner}</Typography>
        <Typography>Room: {reservation.room}</Typography>
        <Typography>State: {ReservationState[reservation.state]}</Typography>
        <Typography>
          Check-in date: {reservation.dateFrom.toDateString()}
        </Typography>
        <Typography>
          Check-out date: {reservation.dateTo.toDateString()}
        </Typography>
      </Container>
    </Button>
  );
}

export default ReservationElement;
