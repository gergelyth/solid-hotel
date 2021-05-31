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

function ReservationConciseElement({
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

export default ReservationConciseElement;
