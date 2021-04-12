import { Button } from "@material-ui/core";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { ReservationState } from "../../../common/types/ReservationState";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import { SetReservationState } from "../../../common/util/solid";

function Checkout(
  reservationId: string,
  dataProtectionInformation: DataProtectionInformation | undefined
): void {
  if (reservationId === "") {
    return;
  }

  // TODO: set data protection information
  console.log(dataProtectionInformation?.dataProtectionYears);
  console.log(dataProtectionInformation?.dataProtectionFieldsMatch);
  console.log(dataProtectionInformation?.dataProtectionFields);

  // SetReservationState(reservationId, ReservationState.PAST);
  // TODO: set past state on the hotel side
}

function CheckoutButton({
  reservationId,
  onClickFunction,
}: {
  reservationId: string;
  onClickFunction: () => void;
}): JSX.Element {
  const dataProtectionInformation = useDataProtectionInformation();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={reservationId === ""}
      onClick={() => {
        Checkout(reservationId, dataProtectionInformation.data);
        onClickFunction();
      }}
    >
      Checkout
    </Button>
  );
}

export default CheckoutButton;
