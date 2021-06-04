import { Button } from "@material-ui/core";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { SubmitCheckoutRequest } from "../../util/outgoingCommunications";

function Checkout(
  reservationId: string,
  reservations: ReservationAtHotel[]
): void {
  if (reservationId === "") {
    return;
  }

  const reservation = reservations.find((x) => x.id === reservationId);
  if (!reservation) {
    //TODO error handling
    return;
  }

  SubmitCheckoutRequest(reservation);
}

function CheckoutButton({
  reservationId,
  reservations,
  onClickFunction,
}: {
  reservationId: string;
  reservations: ReservationAtHotel[];
  onClickFunction: () => void;
}): JSX.Element {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={reservationId === ""}
      onClick={() => {
        Checkout(reservationId, reservations);
        onClickFunction();
      }}
    >
      Checkout
    </Button>
  );
}

export default CheckoutButton;
