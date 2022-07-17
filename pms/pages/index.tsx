import {
  ShowCustomSnackbar,
  ShowSuccessSnackbar,
} from "../../common/components/snackbar";
import { CheckinProgressSnackbar } from "../components/checkin/checkin-progress-snackbar";
import CheckoutProgressSnackbar from "../components/checkout/checkout-progress-snackbar";
import { Button, Grid } from "@material-ui/core";
import { AddReservation } from "../../common/util/solid_reservations";
import { ReservationState } from "../../common/types/ReservationState";
import { GetReservationIdFromInboxUrl } from "../../common/util/urlParser";

//TODO what to show on the PMS index page? - add comment after
export default function Home(): JSX.Element | null {
  let reservationId: string;
  return (
    <Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          const reservation = {
            id: null,
            inbox:
              "https://gergelyth.inrupt.net/reservations/02f0e0a0-48af-11ec-a883-c7d01e95c64a/inbox",
            owner: "https://gergelyth.inrupt.net/profile/card#me",
            hotel: "https://solidhotel.inrupt.net/profile/card#me",
            room: "https://solidhotel.inrupt.net/rooms/4b6f48e0-48a9-11ec-a883-c7d01e95c64a.ttl",
            state: ReservationState.CONFIRMED,
            dateFrom: new Date(),
            dateTo: new Date(),
          };
          const inboxUrl = await AddReservation(reservation);
          ShowSuccessSnackbar("Reservation ready");
          reservationId = GetReservationIdFromInboxUrl(inboxUrl);
          console.log(reservationId);
        }}
      >
        Create reservation
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          console.log(reservationId);
          ShowCustomSnackbar((key) => (
            <CheckinProgressSnackbar
              key={key}
              reservationId={reservationId}
              guestWebId={"https://gergelyth.inrupt.net/profile/card#me"}
              replyInbox={
                "https://gergelyth.inrupt.net/reservations/02f0e0a0-48af-11ec-a883-c7d01e95c64a/inbox"
              }
            />
          ));
        }}
      >
        Checkin
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          console.log(reservationId);
          ShowCustomSnackbar((key) => (
            <CheckoutProgressSnackbar
              key={key}
              reservationId={reservationId}
              reservationOwner={
                "https://solidhotel.inrupt.net/hotelprofiles/16cc26f0-5095-11ec-a883-c7d01e95c64a.ttl#hotelProfile"
              }
              replyInbox={
                "https://gergelyth.inrupt.net/reservations/02f0e0a0-48af-11ec-a883-c7d01e95c64a/inbox"
              }
            />
          ));
        }}
      >
        Checkout
      </Button>
    </Grid>
  );
}
