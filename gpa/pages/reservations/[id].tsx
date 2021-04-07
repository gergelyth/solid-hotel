import { Box } from "@material-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import ReservationDetailsPage from "../../components/checkin/reservation-detail-subpage";

export enum CheckinPage {
  ReservationDetail,
  RequiredFields,
  Success,
}

function ReservationDetail(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(CheckinPage.ReservationDetail);
  const router = useRouter();

  let reservationId = router.query.id;
  if (Array.isArray(reservationId)) {
    reservationId = reservationId[0];
  }

  return (
    <Box>
      <ReservationDetailsPage
        reservationId={reservationId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Box>
  );
}

export default ReservationDetail;
