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
import HotelIcon from "@material-ui/icons/Hotel";
import { GetNightCount, GetStayInterval } from "./stay-details";

/**
 * Displays some basic information about the reservation, such as the count of nights spent at the hotel, as well as the date interval of the stay.
 * @returns A card component where the information described above is displayed as well as click actions are tracked and the passed function is executed.
 */
export function ReservationConciseElement({
  reservation,
  titleElement,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  titleElement: JSX.Element;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Card
      data-testid="reservation-concise-element-card"
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
              {titleElement}
              <Typography variant="body2">
                {GetNightCount(reservation)}
              </Typography>
              <Typography variant="body2">
                {GetStayInterval(reservation)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
