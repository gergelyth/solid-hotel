import { useRouter } from "next/router";
import { SuccessPage } from "../../common/components/success-page";
import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@material-ui/core";
import { ReservationPropertiesPage } from "../components/booking/reservation-properties-subpage";

/** An enum which helps to keep track of which subpage the booking page is currently showing. */
export enum BookingPage {
  ReservationProperties,
  Finish,
}

/**
 * The simple page presenting the user a successful notice in case the booking was successfully created.
 * @returns The success page after booking.
 */
function FinishPage({
  successText,
  currentPage,
}: {
  successText: string;
  currentPage: BookingPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== BookingPage.Finish) {
    return null;
  }

  return <SuccessPage successText={successText} router={router} />;
}

/**
 * @returns An array of strings describing each booking subpage in order.
 */
function GetStepLabels(): string[] {
  return ["Select room and date", "Success"];
}

/**
 * The page displayed for the PMS booking operation.
 * Contains two subpages:
 * 1. lets the user select the room and dates of their stay
 * 2. a success notice informing the user that the booking was successfully created
 * Also contains an indicator for the page the user is currently on.
 * @returns The reservation booking page.
 */
function Booking(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    BookingPage.ReservationProperties
  );

  return (
    <Box>
      <ReservationPropertiesPage
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FinishPage
        successText={"Reservation created!"}
        currentPage={currentPage}
      />

      <Stepper activeStep={currentPage} alternativeLabel>
        {GetStepLabels().map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default Booking;
