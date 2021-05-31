import { useRouter } from "next/router";
import ReservationConciseElement from "../../../common/components/reservations/reservation-concise-element";
import ReservationList from "../../../common/components/reservations/reservation-list";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { Box, Grid, Typography } from "@material-ui/core";
import { ReservationState } from "../../../common/types/ReservationState";
import { HotelDetailsOneLiner } from "../../../common/components/reservations/hotel-details";

function ReservationStatusList({
  userReservationsUrl,
  reservationState,
  reservationsTitle,
}: {
  userReservationsUrl: string | null;
  reservationState: ReservationState;
  reservationsTitle: string;
}): JSX.Element {
  const router = useRouter();

  function OnReservationClick(
    event: React.MouseEvent<HTMLElement>,
    reservation: ReservationAtHotel
  ): void {
    router.push(`/reservations/${encodeURIComponent(reservation.id)}`);
  }

  return (
    <Box>
      <Grid item justify="flex-start">
        <Typography variant="body1">
          <Box px={2} fontWeight="fontWeightBold">
            {reservationsTitle}
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Box px={2}>
          <ReservationList
            reservationsUrl={userReservationsUrl}
            reservationFilter={(reservation: ReservationAtHotel) => {
              return reservation.state === reservationState;
            }}
            reservationElement={(item: ReservationAtHotel) => (
              <ReservationConciseElement
                reservation={item}
                titleElement={<HotelDetailsOneLiner hotelWebId={item.hotel} />}
                onClickAction={OnReservationClick}
              />
            )}
          />
        </Box>
      </Grid>
    </Box>
  );
}

export default ReservationStatusList;
