// TODO: Temporary solution - should unify all success pages

import styles from "../../../common/styles/Home.module.css";
import { NextRouter, useRouter } from "next/router";

function ReturnToReservations(router: NextRouter): void {
  router.push("/reservations");
}

function CheckoutSuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <div className={styles.simpleContainer}>
      <h2>Checkout successful!</h2>
      <button onClick={() => ReturnToReservations(router)}>
        Return to reservations
      </button>
    </div>
  );
}

export default CheckoutSuccessPage;
