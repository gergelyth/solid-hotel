import { Dispatch, SetStateAction, useState } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import {
  AddReservation,
  GetReservationInboxUrl,
  GetSession,
} from "../../../common/util/solid";
import RoomSelector from "./room-selector";
import { Button, Grid, Typography } from "@material-ui/core";
import DateSelector from "./date-selector";
import { BookingPage } from "../../pages/booking";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { SubmitBookingRequest } from "../../util/hotelpodcommunications";

function BookRoom(
  roomIdString: string | undefined,
  checkinDate: Date | undefined,
  checkoutDate: Date | undefined
): void {
  if (!roomIdString || !checkinDate || !checkoutDate) {
    return;
  }

  const room = RoomDefinitionsUrl + roomIdString;
  const session = GetSession();

  const webId = session.info.webId;
  if (!webId) {
    return;
  }

  const reservation = {
    //TODO fix this here as well
    id: "reservation5",
    inbox: GetReservationInboxUrl(session),
    owner: webId,
    hotel: HotelWebId,
    room: room,
    state: ReservationState.WAITING_FOR_CONFIRMATION,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  AddReservation(reservation, session);
  SubmitBookingRequest(reservation, session);
  //TODO subscribe to inbox - possibly wait for solid-client implementation
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
