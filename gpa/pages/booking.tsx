import { useRouter } from "next/router";
import VerifyingComponent, {
  VerifyingPage,
} from "../../common/components/verifying-page";
import { useState } from "react";
import { Box, Stepper, Step, StepLabel } from "@material-ui/core";
import ReservationPropertiesPage from "../components/booking/reservation-properties-subpage";
import RequiredFields from "../components/booking/fields-subpage";

export enum BookingPage {
  ReservationProperties,
  RequiredFields,
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
  const [currentFinishPage, setCurrentFinishPage] = useState(
    VerifyingPage.Waiting
  );

  if (currentPage !== BookingPage.Finish) {
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

function GetStepLabels(): string[] {
  return ["Select room and date", "Input required information", "Verifying"];
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

      <FinishPage
        successText={"Reservation successful!"}
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
