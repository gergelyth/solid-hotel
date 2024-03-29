import { CustomProgressSnackbar } from "../custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar, ShowWarningSnackbar } from "../snackbar";
import { useReservations } from "../../hooks/useReservations";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { NotEmptyItem, ShowError } from "../../util/helpers";
import { ProfileUpdate } from "./tracker-send-change";

/**
 * Sends the approved local profile modifications to the counterparty.
 * Filters the reservations with the filter provided and sends the changes to all counterparties listed in them.
 * Warns the user in case it was called with no approved fields or if there are no reservation which match the criteria.
 */
async function ExecuteSendProfileModification(
  reservations: (ReservationAtHotel | null)[],
  fieldOptions: ProfileUpdate,
  reservationFilter: (reservation: ReservationAtHotel) => boolean,
  sendModification: (
    approvedFields: ProfileUpdate,
    inboxUrl: string
  ) => Promise<void>
): Promise<void> {
  const reservationsWithProfile = reservations
    .filter(NotEmptyItem)
    .filter(reservationFilter);

  if (reservationsWithProfile.length === 0) {
    ShowWarningSnackbar("No reservations found matching filter");
    return;
  }

  const approvedFields = Object.keys(fieldOptions).reduce(function (
    filtered: ProfileUpdate,
    key
  ) {
    if (fieldOptions[key].status) {
      filtered[key] = fieldOptions[key];
    }
    return filtered;
  },
  {});

  if (Object.keys(approvedFields).length === 0) {
    ShowWarningSnackbar(
      "There are no approved fields to send. Sending nothing."
    );
    return;
  }

  await Promise.all(
    reservationsWithProfile.map(async (reservation) => {
      if (!reservation.inbox) {
        ShowWarningSnackbar(
          "Reservation inbox null when trying to send profile modification notification"
        );
        return;
      }
      await sendModification(approvedFields, reservation.inbox);
    })
  );
}

/**
 * Sends the approved local profile modifications to the counterparty.
 * Fetches all reservations which match the filter provided and sends to all counterparties listed in them.
 */
export const SendProfileModificationSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarId: string | number;
    fieldOptions: ProfileUpdate;
    reservationsUrl: string;
    reservationFilter: (reservation: ReservationAtHotel) => boolean;
    sendModification: (
      approvedFields: ProfileUpdate,
      inboxUrl: string
    ) => Promise<void>;
  }
>((props, ref) => {
  const { items: reservations, isError } = useReservations(
    props.reservationsUrl
  );

  useEffect(() => {
    if (isError) {
      CloseSnackbar(props.snackbarId);
      ShowError(
        "Error using the reservation hook during send profile modification operation",
        false
      );
      return;
    }

    if (!reservations) {
      return;
    }

    Promise.all([
      new Promise((res) => setTimeout(res, 2000)),
      ExecuteSendProfileModification(
        reservations,
        props.fieldOptions,
        props.reservationFilter,
        props.sendModification
      ),
    ]).then(() => CloseSnackbar(props.snackbarId));
  }, [reservations, isError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarId}
      message={"Sending profile updates"}
    />
  );
});

SendProfileModificationSnackbar.displayName = "SendProfileModificationSnackbar";
