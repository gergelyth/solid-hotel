import { useRouter } from "next/router";
import VerifyingComponent, {
  VerifyingPage,
} from "../../common/components/verifying-page";
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
  const [currentFinishPage, setCurrentFinishPage] = useState(
    VerifyingPage.Waiting
  );

  if (currentPage !== CheckoutPage.Finish) {
    return null;
  }

  return (
    <VerifyingComponent
      successText={successText}
      router={router}
      currentPage={currentFinishPage}
      setCurrentPage={setCurrentFinishPage}
    />
  );
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
        successText={"Check-out successful!"}
        currentPage={currentPage}
      />
    </Box>
  );
}

export default Checkout;
