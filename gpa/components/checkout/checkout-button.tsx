import { NextRouter, useRouter } from "next/router";
import { useDataProtectionInformation } from "../../hooks/useMockApi";
import styles from "../../styles/Home.module.css";
import { ReservationState } from "../../types/ReservationState";
import { DataProtectionInformation } from "../../util/apiDataRetrieval";
import { SetReservationState } from "../../util/solid";

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
    <div className={styles.simpleContainer}>
      <button
        disabled={!reservationId}
        onClick={() =>
          Checkout(reservationId, dataProtectionInformation.data, router)
        }
      >
        Checkout
      </button>
    </div>
  );
}

export default CheckoutButton;
