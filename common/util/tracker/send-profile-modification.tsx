import CustomProgressSnackbar from "../../components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar, ShowWarningSnackbar } from "../../components/snackbar";
import { useReservations } from "../../hooks/useReservations";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { NotEmptyItem } from "../helpers";
import { ProfileUpdate } from "./trackerSendChange";

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

  console.log("profile modifications sent");
}

const SendProfileModificationSnackbar = forwardRef<
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
      console.error(
        "Error using the reservation hook during send profile modification operation. Unexpected behaviour might occur."
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
      key={props.snackbarId}
      message={"Sending profile updates"}
    />
  );
});

SendProfileModificationSnackbar.displayName = "SendProfileModificationSnackbar";

export default SendProfileModificationSnackbar;
