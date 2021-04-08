import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import ReservationDetailsPage from "../../components/checkin/reservation-detail-subpage";
import CheckinSuccessPage from "../../components/checkin/success-subpage";
import RequiredFieldsAtCheckin from "../../components/checkin/fields-subpage";

export enum CheckinPage {
  ReservationDetail,
  RequiredFields,
  Success,
}

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

      <CheckinSuccessPage currentPage={currentPage} />
    </Box>
  );
}

export default ReservationDetail;
