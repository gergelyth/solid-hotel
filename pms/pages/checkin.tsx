import { SuccessPage } from "../../common/components/verifying-page";
import { Box } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import RequiredFieldsAtCheckin from "../components/checkin/fields-subpage";
import { SetReservationOwnerAndState } from "../../common/util/solid_reservations";
import { ReservationState } from "../../common/types/ReservationState";
import QrComponent from "../components/checkin/qr-subpage";
import { AppProps } from "next/app";
import { GetServerSidePropsResult } from "next";

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

export function getServerSideProps(
  appProps: AppProps
): GetServerSidePropsResult<{
  id: string;
}> {
  const query = appProps.router.query;
  if (!query.id) {
    return {
      notFound: true,
    };
  }

  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  return {
    props: { id },
  };
}

function OfflineCheckin(
  appProps: AppProps<{
    id: string;
  }>
): JSX.Element | null {
  const [currentPage, setCurrentPage] = useState(
    OfflineCheckinPage.RequiredFields
  );

  const router = useRouter();

  const reservationId = appProps.pageProps.id;

  return (
    <Box>
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
