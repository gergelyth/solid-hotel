import { useRouter } from "next/router";
import SuccessPage from "../../common/components/success-page";
import { useState } from "react";
import { Box } from "@material-ui/core";
import ReservationSelectForCheckout from "../components/checkout/reservationselect-subpage";

export enum CheckoutPage {
  ReservationSelect,
  Finish,
}

function FinishPage({
  successText,
  currentPage,
}: {
  successText: string;
  currentPage: CheckoutPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== CheckoutPage.Finish) {
    return null;
  }

  return <SuccessPage successText={successText} router={router} />;
}

function Checkout(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    CheckoutPage.ReservationSelect
  );

  return (
    <Box>
      <ReservationSelectForCheckout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FinishPage
        successText={"Check-out request sent!"}
        currentPage={currentPage}
      />
    </Box>
  );
}

export default Checkout;
