import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { GetUserReservationsPodUrl } from "../../common/util/solidReservations";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationStatusList } from "../../common/components/reservations/reservation-status-list";
import { ReservationState } from "../../common/types/ReservationState";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
import { ReservationClickHandler } from "../../common/types/ReservationClickHandler";
import { ReservationConciseElement } from "../../common/components/reservations/reservation-concise-element";
import { HotelDetailsOneLiner } from "../../common/components/reservations/hotel-details";
import { useRouter } from "next/router";

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
 * The index page for the GPA application, which is also the page for displaying the list of reservations.
 * Shows the reservation lists broken down into categories by their current state.
 * Defines the onReservationClick function to take the user to the reservation detail page in {@link ReservationDetail}
 * @returns The list reservations page.
 */
export default function Home(): JSX.Element {
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
