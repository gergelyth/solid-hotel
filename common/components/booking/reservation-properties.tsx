import { useState } from "react";
import { RoomSelector } from "./room-selector";
import { Button, Grid, Typography } from "@material-ui/core";
import { DateSelector } from "./date-selector";
import { GetToday, GetTomorrow } from "../../util/helpers";

/**
 * Handles the properties of the booking operation, i.e. the selected room and the check-in and check-out dates.
 * @returns A component allowing the user to select the room, the check-in and check-out dates and the button triggering the booking action.
 */
export function BookingProperties({
  onSelectAction,
}: {
  onSelectAction: (
    roomId: string,
    checkinDate: Date,
    checkoutDate: Date
  ) => void;
}): JSX.Element | null {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const [checkinDate, setCheckinDate] = useState<Date>(GetToday());
  const [checkoutDate, setCheckoutDate] = useState<Date>(GetTomorrow());

  return (
    <Grid
      container
      spacing={5}
      justifyContent="center"
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
          data-testid="select-reservation-button"
          disabled={
            !selectedRoomId ||
            selectedRoomId.length === 0 ||
            !checkinDate ||
            !checkoutDate ||
            checkoutDate < checkinDate
          }
          variant="contained"
          color="primary"
          onClick={() =>
            onSelectAction(selectedRoomId, checkinDate, checkoutDate)
          }
        >
          Book room
        </Button>
      </Grid>
    </Grid>
  );
}
