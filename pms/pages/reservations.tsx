import { useRouter } from "next/router";
import ReservationList from "../../common/components/reservations/reservation-list";
import { ReservationsUrl } from "../../common/consts/solidIdentifiers";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import CreateReservationElement from "../components/reservations/reservation-element";
import { Grid, Typography } from "@material-ui/core";

function Reservations(): JSX.Element {
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    //todo does this work?
    router.push(`/profile/${encodeURIComponent(reservation.ownerId)}`);
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <h1>
          <Typography>Reservations</Typography>
        </h1>
      </Grid>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      <Grid item>
        <ReservationList
          reservationsUrl={ReservationsUrl}
          reservationFilter={() => true}
          reservationElement={(reservation: ReservationAtHotel) =>
            CreateReservationElement(reservation, OnReservationClick)
          }
        />
      </Grid>
    </Grid>
  );
}

export default Reservations;
