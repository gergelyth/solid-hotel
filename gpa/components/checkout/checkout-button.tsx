import { useDataProtectionInformation } from "../../hooks/useMockApi";
import styles from "../../styles/Home.module.css";
import { DataProtectionInformation } from "../../util/apiDataRetrieval";

function Checkout(
  reservationId: string | undefined,
  dataProtectionInformation: DataProtectionInformation | undefined
): void {
  if (!reservationId) {
    return;
  }

  console.log(dataProtectionInformation?.dataProtectionYears);
  console.log(dataProtectionInformation?.dataProtectionFieldsMatch);
  console.log(dataProtectionInformation?.dataProtectionFields);
}

function CheckoutButton({
  reservationId,
}: {
  reservationId: string | undefined;
}): JSX.Element {
  const dataProtectionInformation = useDataProtectionInformation();

  return (
    <div className={styles.simpleContainer}>
      <button
        disabled={!reservationId}
        onClick={() => Checkout(reservationId, dataProtectionInformation.data)}
      >
        Checkout
      </button>
    </div>
  );
}

export default CheckoutButton;
