import CustomProgressSnackbar from "../../components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar, ShowWarningSnackbar } from "../../components/snackbar";
import { useReservations } from "../../hooks/useReservations";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { NotEmptyItem } from "../helpers";
import { ProfileUpdate } from "./trackerSendChange";
import { SendProfileModification } from "../../../pms/util/outgoingCommunications";

async function ExecuteSendProfileModification(
  reservations: (ReservationAtHotel | null)[],
  fieldOptions: ProfileUpdate,
  reservationFilter: (reservation: ReservationAtHotel) => boolean
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
      await SendProfileModification(approvedFields, reservation.inbox);
    })
  );

  console.log("profile modifications sent");
}

const SendProfileModificationSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    fieldOptions: ProfileUpdate;
    reservationsUrl: string;
    reservationFilter: (reservation: ReservationAtHotel) => boolean;
  }
>((props, ref) => {
  const { items: reservations, isError } = useReservations(
    props.reservationsUrl
  );

  useEffect(() => {
    if (isError) {
      CloseSnackbar(props.key);
      throw new Error(
        "Error using the reservation hook during send profile modification operation."
      );
    }

    if (!reservations) {
      return;
    }

    Promise.all([
      new Promise((res) => setTimeout(res, 2000)),
      ExecuteSendProfileModification(
        reservations,
        props.fieldOptions,
        props.reservationFilter
      ),
    ]).then(() => CloseSnackbar(props.key));
  }, [reservations, isError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Sending profile updates"}
    />
  );
});

SendProfileModificationSnackbar.displayName = "SendProfileModificationSnackbar";

export default SendProfileModificationSnackbar;
