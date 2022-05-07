import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ConciseHotelReservationElement from "./concise-hotel-reservation";
import { Box, Button, Dialog, Grid } from "@material-ui/core";
import CancelReservationButton from "../../../common/components/cancellation/cancellation";
import OfflineCheckinButton from "../checkin/offline-checkin-button";
import { ReservationState } from "../../../common/types/ReservationState";
import { DoOnStateChange } from "../../util/actionOnNewReservationState";
import { Dispatch, SetStateAction, useState } from "react";
import { QrElementWithHeadings } from "../checkin/qr-subpage";

export function ConfirmCancellation(reservation: ReservationAtHotel): void {
  if (!reservation.id) {
    throw new Error("Reservation ID is null");
  }

  if (!reservation.inbox) {
    throw new Error("Guest inbox for reservation is null");
  }

  DoOnStateChange(
    reservation.id,
    ReservationState.CANCELLED,
    reservation.inbox
  );
}

function PairingQrPopup({
  reservationId,
  isPopupShowing,
  setPopupVisibility,
}: {
  reservationId: string | null;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  if (!reservationId) {
    console.log("Reservation ID is null for pairing QR popup!");
    return null;
  }
  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      open={isPopupShowing}
      maxWidth="md"
    >
      <Grid item>
        <Box m={2} p={2}>
          <QrElementWithHeadings reservationId={reservationId} />
        </Box>
      </Grid>
    </Dialog>
  );
}

function ConfirmedReservationDetails({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={8}>
        <ConciseHotelReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
      <Grid item xs={4} container justify="flex-end" direction="row">
        <Grid item>
          <OfflineCheckinButton reservation={reservation} />
        </Grid>
        <Grid item>
          <CancelReservationButton
            reservation={reservation}
            confirmCancellation={ConfirmCancellation}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

function ActiveUnpairedReservationDetails({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  const [isQrPopupShowing, setQrPopupVisibility] = useState(false);
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={10}>
        <ConciseHotelReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
      <Grid item xs={2} container justify="center" direction="row">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setQrPopupVisibility(true);
            }}
          >
            Pairing QR
          </Button>
        </Grid>
      </Grid>
      <PairingQrPopup
        reservationId={reservation.id}
        isPopupShowing={isQrPopupShowing}
        setPopupVisibility={setQrPopupVisibility}
      />
    </Grid>
  );
}

function OtherReservationDetails({
  reservation,
  onClickAction,
}: {
  reservation: ReservationAtHotel;
  onClickAction: ReservationClickHandler;
}): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={12}>
        <ConciseHotelReservationElement
          reservation={reservation}
          onClickAction={onClickAction}
        />
      </Grid>
    </Grid>
  );
}

function CreateReservationElement(
  reservation: ReservationAtHotel,
  onClickAction: ReservationClickHandler
): JSX.Element {
  if (reservation.state == ReservationState.CONFIRMED) {
    return (
      <ConfirmedReservationDetails
        reservation={reservation}
        onClickAction={onClickAction}
      />
    );
  } else if (
    reservation.state == ReservationState.ACTIVE &&
    !reservation.inbox
  ) {
    return (
      <ActiveUnpairedReservationDetails
        reservation={reservation}
        onClickAction={onClickAction}
      />
    );
  } else {
    return (
      <OtherReservationDetails
        reservation={reservation}
        onClickAction={onClickAction}
      />
    );
  }
}

export default CreateReservationElement;
