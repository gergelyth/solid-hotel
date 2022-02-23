import { Dispatch, SetStateAction } from "react";
import { Box } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { GetDayAfterDate, GetToday, GetTomorrow } from "../../util/helpers";

function DateSelector({
  checkinDate,
  setCheckinDate,
  checkoutDate,
  setCheckoutDate,
}: {
  checkinDate: Date;
  setCheckinDate: Dispatch<SetStateAction<Date>>;
  checkoutDate: Date;
  setCheckoutDate: Dispatch<SetStateAction<Date>>;
}): JSX.Element {
  return (
    <Box>
      <Box pb={1}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disablePast
            format="dd/MMM/yyyy"
            label="Check-in date"
            views={["year", "month", "date"]}
            value={checkinDate}
            onChange={(date: Date | null) => setCheckinDate(date ?? GetToday())}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box py={1}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            minDate={GetDayAfterDate(checkinDate)}
            format="dd/MMM/yyyy"
            label="Check-out date"
            minDateMessage="Must be AFTER check-in date!"
            views={["year", "month", "date"]}
            value={checkoutDate}
            onChange={(date: Date | null) =>
              setCheckoutDate(date ?? GetTomorrow())
            }
          />
        </MuiPickersUtilsProvider>
      </Box>
    </Box>
  );
}

export default DateSelector;
