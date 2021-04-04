import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@material-ui/core";
import ReservationPropertiesPage from "../components/booking/reservation-properties-subpage";
import BookingSuccessPage from "../components/booking/success-subpage";
import RequiredFields from "../components/booking/fields-subpage";

export enum BookingPage {
  ReservationProperties,
  RequiredFields,
  Success,
}

function GetStepLabels(): string[] {
  return ["Select room and date", "Input required information", "Success"];
}

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

      <BookingSuccessPage currentPage={currentPage} />

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
