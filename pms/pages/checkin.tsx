import { SuccessPage } from "../../common/components/verifying-page";
import { Box } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import RequiredFieldsAtCheckin from "../components/checkin/fields-subpage";
import { SetReservationOwnerAndState } from "../../common/util/solid_reservations";
import { ReservationState } from "../../common/types/ReservationState";
import QrComponent from "../components/checkin/qr-subpage";

export enum OfflineCheckinPage {
  RequiredFields,
  QrComponent,
  Finish,
}

function FinishPage({
  router,
  successText,
  currentPage,
}: {
  router: NextRouter;
  successText: string;
  currentPage: OfflineCheckinPage;
}): JSX.Element | null {
  if (currentPage !== OfflineCheckinPage.Finish) {
    return null;
  }

  return <SuccessPage successText={successText} router={router} />;
}

function OfflineCheckin(): JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(
    OfflineCheckinPage.RequiredFields
  );

  const router = useRouter();

  const queryId = router.query.id;
  if (!queryId) {
    router.push("/404");
    return null;
  }

  const reservationId = Array.isArray(queryId) ? queryId[0] : queryId;

  return (
    <Box width={1}>
      <RequiredFieldsAtCheckin
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        executeCheckin={(hotelProfileWebId: string) => {
          SetReservationOwnerAndState(
            reservationId,
            hotelProfileWebId,
            ReservationState.ACTIVE
          );
        }}
      />

      <QrComponent
        reservationId={reservationId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FinishPage
        router={router}
        successText={"Check-in successful!"}
        currentPage={currentPage}
      />
    </Box>
  );
}

export default OfflineCheckin;
