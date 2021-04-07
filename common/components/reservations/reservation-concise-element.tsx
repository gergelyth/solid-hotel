import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { format, eachDayOfInterval } from "date-fns";
import HotelIcon from "@material-ui/icons/Hotel";

function ReservationConciseElement({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  const intervalDays = eachDayOfInterval({
    start: reservation.dateFrom,
    end: reservation.dateTo,
  });
  const nightCount = intervalDays.length - 1;
  const nightsStr = `${nightCount} nights`;

  return (
    <Card
      onClick={(event: React.MouseEvent<HTMLElement>) =>
        onClickAction(event, reservation)
      }
    >
      <CardActionArea>
        <CardContent>
          <Grid container spacing={4} alignItems="center" direction="row">
            <Grid item>
              <Box fontSize={40}>
                <HotelIcon fontSize="inherit" />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="body2">Hotel name, country</Typography>
              <Typography variant="body2">{nightsStr}</Typography>
              <Typography variant="body2">
                {format(reservation.dateFrom, "MMMM do, yyyy")} -{" "}
                {format(reservation.dateTo, "MMMM do, yyyy")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ReservationConciseElement;
