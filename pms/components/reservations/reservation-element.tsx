import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { ReservationClickHandler } from "../../../common/types/ReservationClickHandler";
import ConciseHotelReservationElement from "./concise-hotel-reservation";
import { Box, Button, Dialog, Grid } from "@material-ui/core";
import { CancelReservationButton } from "../../../common/components/cancellation/cancellation";
import OfflineCheckinButton from "../checkin/offline-checkin-button";
import { ReservationState } from "../../../common/types/ReservationState";
import { DoOnStateChange } from "../../util/actionOnNewReservationState";
import { Dispatch, SetStateAction, useState } from "react";
import { QrElementWithHeadings } from "../checkin/qr-subpage";

//TODO this is not correct that the cancel button calls this - we need to call the cancel snackbar stuff to remove privacy tokens as well
/**
 * The function which executes the state change of the cancellation.
 */
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

/**
 * The popup dialog containing the QR code used for pairing the reservation with a guest Solid Pod.
 * @returns The QR code dialog or null (is the dialog is not showing).
 */
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

/**
 * Creates an enriched version of the {@link ReservationConciseElement} component adding the offline check-in and the cancel reservation button.
 * @returns The reservation element with confirmed reservation functionalities.
 */
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

/**
 * Creates an enriched version of the {@link ReservationConciseElement} component adding a button which show the pairing QR code in a popup dialog.
 * Also logically contains the QR popup element.
 * @returns The reservation element with a QR popup triggering button.
 */
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

/**
 * A wrapper for the {@link ReservationConciseElement} component, encompassing it in in a Grid element.
 * @returns The element for all reservations not needing specific functionalities.
 */
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

/**
 * A PMS wrapper for the {@link ReservationConciseElement} component.
 * This is the function which instructs what type of component to show in the list reservations page.
 * In order to enrich the component with PMS specific information, we make a distinction between
 * - the confirmed reservations ({@link ConfirmedReservationDetails})
 * - the unpaired reservations ({@link ActiveUnpairedReservationDetails})
 * - all other types ({@link ConciseHotelReservationElement})
 * @returns The reservation element.
 */
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
