import { useRouter } from "next/router";
import { ReservationsUrl } from "../../common/consts/solidIdentifiers";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { CreateReservationElement } from "../components/reservations/reservation-element";
import { Grid, Typography, Box } from "@material-ui/core";
import { ReservationState } from "../../common/types/ReservationState";
import { ReservationStatusList } from "../../common/components/reservations/reservation-status-list";

/**
 * The PMS page for displaying the list of reservations.
 * Shows the reservation lists broken down into categories by their current state.
 * Defines the onReservationClick function to take the user to either
 * - the hotel profile page ({@link ActiveHotelProfileDetail})
 * - the data protection profile page ({@link DataProtectionProfileDetail})
 * depending on the state of the reservation.
 * @returns The list reservations page.
 */
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
      alignItems="stretch"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">
          <Box textAlign="center">Reservations</Box>
        </Typography>
      </Grid>

      <Grid item>
        <ReservationStatusList
          reservationsUrl={ReservationsUrl}
          reservationFilter={(state: ReservationState) =>
            state === ReservationState.ACTIVE
          }
          reservationsTitle="Active reservations"
          createReservationElement={(reservation: ReservationAtHotel) =>
            CreateReservationElement(reservation, OnReservationClick)
          }
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={ReservationsUrl}
          reservationFilter={(state: ReservationState) =>
            state === ReservationState.CONFIRMED
          }
          reservationsTitle="Confirmed upcoming reservations"
          createReservationElement={(reservation: ReservationAtHotel) =>
            CreateReservationElement(reservation, OnReservationClick)
          }
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={ReservationsUrl}
          reservationFilter={(state: ReservationState) =>
            state === ReservationState.PAST ||
            state === ReservationState.CANCELLED
          }
          reservationsTitle="Past and cancelled reservations"
          createReservationElement={(reservation: ReservationAtHotel) =>
            CreateReservationElement(reservation, OnReservationClick)
          }
        />
      </Grid>
    </Grid>
  );
}

export default Reservations;
