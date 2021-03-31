import { Button } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { ReservationState } from "../../../common/types/ReservationState";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import { SetReservationState } from "../../../common/util/solid";

function Checkout(
  reservationId: string | undefined,
  dataProtectionInformation: DataProtectionInformation | undefined,
  router: NextRouter
): void {
  if (!reservationId) {
    return;
  }

  // TODO: set data protection information
  console.log(dataProtectionInformation?.dataProtectionYears);
  console.log(dataProtectionInformation?.dataProtectionFieldsMatch);
  console.log(dataProtectionInformation?.dataProtectionFields);

  SetReservationState(reservationId, ReservationState.PAST);
  // TODO: set past state on the hotel side

  router.push("/checkout/success");
}

function CheckoutButton({
  reservationId,
}: {
  reservationId: string | undefined;
}): JSX.Element {
  const router = useRouter();
  const dataProtectionInformation = useDataProtectionInformation();

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!reservationId}
      onClick={() =>
        Checkout(reservationId, dataProtectionInformation.data, router)
      }
    >
      Checkout
    </Button>
  );
}

export default CheckoutButton;
