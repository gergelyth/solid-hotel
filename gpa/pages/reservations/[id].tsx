import { SuccessPage } from "../../../common/components/success-page";
import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { ReservationDetailsPage } from "../../components/checkin/reservation-detail-subpage";
import { RequiredFieldsAtCheckin } from "../../components/checkin/fields-subpage";

/** An enum which helps to keep track of which subpage the reservation details page is currently showing. */
export enum CheckinPage {
  ReservationDetail,
  RequiredFields,
  Finish,
}

/**
 * The simple page presenting the user a successful notice in case the check-in was successfully requested.
 * @returns The success page after check-in.
 */
function FinishPage({
  successText,
  currentPage,
}: {
  successText: string;
  currentPage: CheckinPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== CheckinPage.Finish) {
    return null;
  }

  return <SuccessPage successText={successText} router={router} />;
}

/**
 * The page displayed for a specific reservation given by the ID.
 * The reservation ID is given as a query parameter.
 * Shows reservation information, but is also the entry point for the cancel and check-in operations as well.
 * @returns The reservation detail page.
 */
function ReservationDetail(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(CheckinPage.ReservationDetail);

  const [executeCheckin, setExecuteCheckin] = useState<() => () => void>(
    () => () => {
      throw new Error("Execute check-in function is null.");
    }
  );

  const router = useRouter();

  let reservationId = router.query.id;
  if (Array.isArray(reservationId)) {
    reservationId = reservationId[0];
  }

  return (
    <Box>
      <ReservationDetailsPage
        reservationId={reservationId}
        setExecuteCheckin={setExecuteCheckin}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <RequiredFieldsAtCheckin
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        executeCheckin={executeCheckin}
      />

      <FinishPage
        successText={"Check-in request sent!"}
        currentPage={currentPage}
      />
    </Box>
  );
}

export default ReservationDetail;
