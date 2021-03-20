// TODO: Temporary solution to hook mismatch in reservation/[id]

import styles from "../../../common/styles/Home.module.css";
import { NextRouter, useRouter } from "next/router";

function ReturnToReservations(router: NextRouter): void {
  router.push("/reservations");
}
function CheckinSuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <div className={styles.simpleContainer}>
      <h2>Check-in successful!</h2>
      <button onClick={() => ReturnToReservations(router)}>
        Return to reservations
      </button>
    </div>
  );
}

export default CheckinSuccessPage;
