import { Dispatch, SetStateAction } from "react";
import { ReservationConciseElement } from "../../../common/components/reservations/reservation-concise-element";
import {
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@material-ui/core";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { HotelDetailsOneLiner } from "../../../common/components/reservations/hotel-details";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";

function ReservationRadioSelector({
  selectedReservationId,
  setSelectedReservationId,
  filteredReservations,
}: {
  selectedReservationId: string;
  setSelectedReservationId: Dispatch<SetStateAction<string>>;
  filteredReservations: ReservationAtHotel[];
}): JSX.Element {
  return (
    <Box px={2}>
      <FormControl>
        <RadioGroup
          value={selectedReservationId}
          onChange={(e, newValue) => setSelectedReservationId(newValue)}
        >
          <Grid container spacing={2} direction="column">
            {filteredReservations.map((item) => (
              <Grid item key={item?.id}>
                <FormControlLabel
                  disabled={!item}
                  value={item?.id}
                  control={<Radio />}
                  label={
                    <ReservationConciseElement
                      reservation={item}
                      titleElement={
                        <HotelDetailsOneLiner hotelWebId={item.hotel} />
                      }
                      onClickAction={() => {
                        if (!item?.id) {
                          ShowErrorSnackbar("Reservation ID is null");
                          return;
                        }
                        setSelectedReservationId(item.id);
                      }}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default ReservationRadioSelector;
