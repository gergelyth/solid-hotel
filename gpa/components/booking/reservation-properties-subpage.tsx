import { Dispatch, SetStateAction, useState } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import { AddReservation, GetSession } from "../../../common/util/solid";
import { AddReservationToHotelPod } from "../../../common/util/solidhoteladmin";
import RoomSelector from "./room-selector";
import { Button, Grid, Typography } from "@material-ui/core";
import DateSelector from "./date-selector";
import { BookingPage } from "../../pages/booking";
import { HotelWebId } from "../../../common/consts/solidIdentifiers";

function BookRoom(
  roomIdString: string | undefined,
  checkinDate: Date | undefined,
  checkoutDate: Date | undefined
): void {
  if (!roomIdString || !checkinDate || !checkoutDate) {
    return;
  }
  //TODO fix this ID nonsense
  const roomId = +roomIdString.replace("room", "");
  const reservation = {
    //TODO fix this here as well
    id: `reservation${roomId}`,
    ownerId: 10,
    hotel: HotelWebId,
    roomId: roomId,
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
  setConfirmReservation,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
  setConfirmReservation: Dispatch<SetStateAction<() => () => void>>;
}): JSX.Element | null {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [checkinDate, setCheckinDate] = useState<Date>();
  const [checkoutDate, setCheckoutDate] = useState<Date>();

  //TODO if there is an error in log then call useRooms() always here, but add a parameter condition in it to return null if false
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
        <Typography variant="h4">Please select a room</Typography>
      </Grid>
      <Grid item>
        <RoomSelector
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      </Grid>

      <Grid item>
        <DateSelector
          checkinDate={checkinDate}
          setCheckinDate={setCheckinDate}
          checkoutDate={checkoutDate}
          setCheckoutDate={setCheckoutDate}
        />
      </Grid>

      <Grid item>
        <Button
          disabled={
            !selectedRoomId ||
            selectedRoomId.length === 0 ||
            !checkinDate ||
            !checkoutDate ||
            checkoutDate < checkinDate
          }
          variant="contained"
          color="primary"
          onClick={() => {
            setConfirmReservation(() => () => {
              BookRoom(selectedRoomId, checkinDate, checkoutDate);
            });
            setCurrentPage(currentPage + 1);
          }}
        >
          Book room
        </Button>
      </Grid>
    </Grid>
  );
}

export default ReservationPropertiesPage;
