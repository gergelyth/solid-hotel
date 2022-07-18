import { useRouter } from "next/router";
import { SuccessPage } from "../../common/components/success-page";
import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@material-ui/core";
import { ReservationPropertiesPage } from "../components/booking/reservation-properties-subpage";
import { RequiredFields } from "../components/booking/fields-subpage";

/** An enum which helps to keep track of which subpage the booking page is currently showing. */
export enum BookingPage {
  ReservationProperties,
  RequiredFields,
  Finish,
}

/**
 * The simple page presenting the user a successful notice in case the booking was successfully requested.
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
  return ["Select room and date", "Input required information", "Success"];
}

/**
 * The page displayed for the GPA booking operation.
 * Contains three subpages:
 * 1. lets the user select the room and dates of their stay
 * 2. requires the user to input values for all required fields based on their nationality and the hotel's location
 * 3. a success notice informing the user that the request was sent to the hotel
 * Also contains an indicator for the page the user is currently on.
 * @returns The reservation booking page.
 */
function Booking(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    BookingPage.ReservationProperties
  );

  const [confirmReservation, setConfirmReservation] = useState<
    () => () => void
  >(() => () => {
    throw new Error("Confirm reservation function is null.");
  });

  return (
    <Box>
      <ReservationPropertiesPage
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setConfirmReservation={setConfirmReservation}
      />

      <RequiredFields
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        confirmReservation={confirmReservation}
      />

      <FinishPage
        successText={"Booking request sent!"}
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
