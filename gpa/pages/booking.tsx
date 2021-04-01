import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { GetCurrentDatePushedBy } from "../test/setup/populateHotelPod/withReservations";
import { ReservationState } from "../../common/types/ReservationState";
import { AddReservation, GetSession } from "../../common/util/solid";
import { AddReservationToHotelPod } from "../../common/util/solidhoteladmin";
import RoomSelector from "../components/booking/room-selector";
import {
  Box,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@material-ui/core";

enum BookingPage {
  ReservationProperties,
  //SPE page
  Success,
}

function GetStepLabels(): string[] {
  return ["Select room and date", "Input required information", "Success"];
}

function BookRoom(roomId: string, checkinDate: Date, checkoutDate: Date): void {
  const reservation = {
    id: roomId,
    ownerId: 10,
    roomId: 0,
    state: ReservationState.CONFIRMED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  const session = GetSession();
  AddReservation(reservation, session);
  // TODO: POSTER permission not working - currently it's set to EDITOR
  AddReservationToHotelPod(reservation, session);
}

function ReservationPropertiesPage({
  currentPage,
  setCurrentPage,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
}): JSX.Element | null {
  if (currentPage !== BookingPage.ReservationProperties) {
    return null;
  }

  return (
    <Grid
      container
      spacing={5}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <h1>
          <Typography>Please select a room</Typography>
        </h1>
      </Grid>
      <Grid item>
        <RoomSelector />
      </Grid>
      <Grid item>
        <Typography>==============================================</Typography>
      </Grid>
      <Grid item>
        <Typography>
          <i>Add date picker and CSS for actual room select here.</i>
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          <i>
            For now it will select the first room and pick dates a few days in
            the future.
          </i>
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            BookRoom(
              "reservation100",
              GetCurrentDatePushedBy(0, 0, 5),
              GetCurrentDatePushedBy(0, 0, 10)
            );
            setCurrentPage(currentPage + 1);
          }}
        >
          Book room
        </Button>
      </Grid>
    </Grid>
  );
}

function SuccessPage({
  currentPage,
  router,
}: {
  currentPage: BookingPage;
  router: NextRouter;
}): JSX.Element | null {
  if (currentPage !== BookingPage.Success) {
    return null;
  }

  return (
    <Box>
      <h2>
        <Typography>Reservation successful!</Typography>
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Return to index page
      </Button>
    </Box>
  );
}

function Booking(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    BookingPage.ReservationProperties
  );
  const router = useRouter();

  const steps = GetStepLabels();

  return (
    <Box>
      <ReservationPropertiesPage
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <SuccessPage currentPage={currentPage} router={router} />

      <Stepper activeStep={currentPage} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default Booking;
