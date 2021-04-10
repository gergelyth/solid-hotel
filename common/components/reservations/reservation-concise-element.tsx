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
import { GetHotelInformation } from "./hotel-details";
import { GetNightCount, GetStayInterval } from "./stay-details";

function ReservationConciseElement({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  const hotelDetails = GetHotelInformation(reservation.hotel);

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
              <Typography variant="body2">{hotelDetails}</Typography>
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

export default ReservationConciseElement;
