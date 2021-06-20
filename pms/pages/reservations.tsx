import { useRouter } from "next/router";
import ReservationList from "../../common/components/reservations/reservation-list";
import { ReservationsUrl } from "../../common/consts/solidIdentifiers";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import CreateReservationElement from "../components/reservations/reservation-element";
import { Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../common/types/ReservationState";

function Reservations(): JSX.Element {
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    switch (reservation.state) {
      case ReservationState.ACTIVE:
        router.push({
          pathname: "/activeprofile/[id]",
          query: { id: reservation.owner },
        });
        break;

      case ReservationState.PAST:
        router.push({
          pathname: "/dataprotectionprofile/[id]",
          query: { id: reservation.owner },
        });
        break;

      default:
        break;
    }
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
        <Grid item>
          <Typography variant="h4">Reservations</Typography>
        </Grid>
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
