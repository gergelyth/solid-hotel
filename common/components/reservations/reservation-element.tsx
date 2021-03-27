import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../common/types/ReservationState";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import { Button, Container } from "@material-ui/core";

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
      <Container>
        <h3>Owner: {reservation.ownerId}</h3>
        <div>Room: {reservation.roomId}</div>
        <div>State: {ReservationState[reservation.state]}</div>
        <div>Check-in date: {reservation.dateFrom.toDateString()}</div>
        <div>Check-out date: {reservation.dateTo.toDateString()}</div>
      </Container>
    </Button>
  );
}

export default ReservationElement;
