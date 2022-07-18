import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../common/types/ReservationState";
import { ReservationStatusList } from "../../common/components/reservations/reservation-status-list";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { useRouter } from "next/router";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import { ReservationConciseElement } from "../../common/components/reservations/reservation-concise-element";
import { HotelDetailsOneLiner } from "../../common/components/reservations/hotel-details";
import { ReservationClickHandler } from "../../common/types/ReservationClickHandler";

/**
 * A GPA wrapper for the {@link ReservationConciseElement} component.
 * This is the function which instructs what type of component to show in the list reservations page.
 * @returns The reservation element.
 */
function CreateReservationElement(
  item: ReservationAtHotel,
  onClickAction: ReservationClickHandler
): JSX.Element {
  return (
    <ReservationConciseElement
      reservation={item}
      titleElement={<HotelDetailsOneLiner hotelWebId={item.hotel} />}
      onClickAction={onClickAction}
    />
  );
}

/**
 * The GPA page for displaying the list of reservations.
 * Shows the reservation lists broken down into categories by their current state.
 * Defines the onReservationClick function to take the user to the reservation detail page in {@link ReservationDetail}
 * @returns The list reservations page.
 */
function Reservations(): JSX.Element {
  const userReservationsUrl = GetUserReservationsPodUrl();

  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    if (!reservation.id) {
      ShowErrorSnackbar("Reservation ID is null");
      return;
    }
    router.push(`/reservations/${encodeURIComponent(reservation.id)}`);
  }

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item>
        <Box textAlign="center">
          <Typography variant="h4">Your reservations</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box fontStyle="italic" textAlign="center">
          <Typography variant="caption">
            This is a list of all reservations made across various hotels.
          </Typography>
          <Typography variant="caption">
            Actionable reservations are highlighted.
          </Typography>
        </Box>
      </Grid>

      <Grid item>
        <ReservationStatusList
          reservationsUrl={userReservationsUrl}
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
          reservationsUrl={userReservationsUrl}
          reservationFilter={(state: ReservationState) =>
            state === ReservationState.REQUESTED
          }
          reservationsTitle="Requested reservations"
          createReservationElement={(reservation: ReservationAtHotel) =>
            CreateReservationElement(reservation, OnReservationClick)
          }
        />
      </Grid>
      <Grid item>
        <ReservationStatusList
          reservationsUrl={userReservationsUrl}
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
          reservationsUrl={userReservationsUrl}
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
