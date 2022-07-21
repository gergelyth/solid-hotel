import { Button } from "@material-ui/core";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ShowError } from "../../../common/util/helpers";
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
    ShowError(`Reservation not found based on ID ${reservationId}`, true);
    return;
  }

  SubmitCheckoutRequest(reservation);
}

/**
 * A button whose onClick event triggers the check-out action.
 * Also has the option to provide onClick actions in an argument.
 * @returns A check-out button for a given reservation.
 */
export function CheckoutButton({
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
      data-testid="checkout-button"
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
