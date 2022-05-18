import { useRouter } from "next/router";
import SuccessPage from "../../common/components/success-page";
import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@material-ui/core";
import ReservationPropertiesPage from "../components/booking/reservation-properties-subpage";

export enum BookingPage {
  ReservationProperties,
  Finish,
}

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

function GetStepLabels(): string[] {
  return ["Select room and date", "Success"];
}

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
