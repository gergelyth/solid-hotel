import { Button } from "@material-ui/core";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { SubmitCheckoutRequest } from "../../util/outgoingCommunications";

/**
 * Submits the check-out request to the hotel Pod.
 */
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

/**
 * A button whose onClick event triggers the check-out action.
 * Also has the option to provide onClick actions in an argument.
 * @returns A check-out button for a given reservation.
 */
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
