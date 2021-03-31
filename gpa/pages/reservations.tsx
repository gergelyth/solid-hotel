import { useRouter } from "next/router";
import ReservationElement from "../../common/components/reservations/reservation-element";
import ReservationList from "../../common/components/reservations/reservation-list";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../common/util/solid";
import { Grid, Typography } from "@material-ui/core";

function Reservations(): JSX.Element {
  const userReservationsUrl = GetUserReservationsPodUrl();
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    router.push(`/reservations/${encodeURIComponent(reservation.id)}`);
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
          <Typography>Your reservations (from user Pod)</Typography>
        </h1>
      </Grid>
      {/* <h2>Reservation count: {reservations.length}</h2> */}

      <Grid item>
        <ReservationList
          reservationsUrl={userReservationsUrl}
          reservationFilter={() => true}
          reservationElement={(item: ReservationAtHotel) => (
            <ReservationElement
              reservation={item}
              onClickAction={OnReservationClick}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default Reservations;
