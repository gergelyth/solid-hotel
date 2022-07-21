import { SuccessPage } from "../../common/components/success-page";
import { Box } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import { RequiredFieldsAtOfflineCheckin } from "../components/checkin/fields-subpage";
import { SetReservationOwnerAndState } from "../../common/util/solidReservations";
import { ReservationState } from "../../common/types/ReservationState";
import { QrComponent } from "../components/checkin/qr-subpage";
import { GetServerSidePropsResult } from "next";
import { RevalidateReservations } from "../../common/hooks/useReservations";

/** An enum which helps to keep track of which subpage the offline check-in page is currently showing. */
export enum OfflineCheckinPage {
  RequiredFields,
  QrComponent,
  Finish,
}

/**
 * The simple page presenting the user a successful notice in case the offline check-in was successfully completed.
 * @returns The success page after offline check-in.
 */
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

export function getServerSideProps(): GetServerSidePropsResult<unknown> {
  return {
    props: {},
  };
}

/**
 * The page guiding the user through the offline check-in operation.
 * The reservation ID is passed as a query parameter.
 * Contains three subpages:
 * 1. requires the user to input values for all required fields based on the guest's nationality and the hotel's location
 * 2. displays a QR code which the hotel employee can show to the guest taking them to the GPA pairing page {@link QrComponent}
 * 3. a success notice informing the user that the offline check-in operation was successfully finished
 * @returns The offline check-in page.
 */
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
      <RequiredFieldsAtOfflineCheckin
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        executeCheckin={(hotelProfileWebId: string) => {
          SetReservationOwnerAndState(
            reservationId,
            hotelProfileWebId,
            ReservationState.ACTIVE
          );
          RevalidateReservations();
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
