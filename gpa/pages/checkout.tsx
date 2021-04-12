import { useState } from "react";
import { Box } from "@material-ui/core";
import ReservationSelectForCheckout from "../components/checkout/reservationselect-subpage";
import CheckoutSuccessPage from "../components/checkout/success-subpage";

export enum CheckoutPage {
  ReservationSelect,
  Success,
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

      <CheckoutSuccessPage currentPage={currentPage} />
    </Box>
  );
}

export default Checkout;
