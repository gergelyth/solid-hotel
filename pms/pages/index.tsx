import {
  ShowCustomSnackbar,
  ShowSuccessSnackbar,
} from "../../common/components/snackbar";
import { CheckinProgressSnackbar } from "../components/checkin/checkin-progress-snackbar";
import { CheckoutProgressSnackbar } from "../components/checkout/checkout-progress-snackbar";
import { Button, Grid } from "@material-ui/core";
import { AddReservation } from "../../common/util/solidReservations";
import { ReservationState } from "../../common/types/ReservationState";
import { GetReservationIdFromInboxUrl } from "../../common/util/urlParser";

//TODO what to show on the PMS index page? - add comment after
export default function Home(): JSX.Element | null {
  return null;
}
