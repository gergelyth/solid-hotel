import { useRouter } from "next/router";
import { SuccessPage } from "../../common/components/success-page";
import { useState } from "react";
import { Box } from "@material-ui/core";
import { ReservationSelectForCheckout } from "../components/checkout/reservationselect-subpage";

/** An enum which helps to keep track of which subpage the check-out page is currently showing. */
export enum CheckoutPage {
  ReservationSelect,
  Finish,
}

/**
 * The simple page presenting the user a successful notice in case the check-out was successfully requested.
 * @returns The success page after check-out.
 */
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

/**
 * The page displayed for the GPA check-out operation.
 * Contains two subpages:
 * 1. lets the user select the reservation they wish to check-out of
 * 2. a success notice informing the user that the check-out request was sent to the hotel
 * @returns The reservation check-out page.
 */
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
