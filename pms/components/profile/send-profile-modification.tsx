import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { ReservationsUrl } from "../../../common/consts/solidIdentifiers";
import {
  CloseSnackbar,
  ShowWarningSnackbar,
} from "../../../common/components/snackbar";
import { useReservations } from "../../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { NotEmptyItem } from "../../../common/util/helpers";
import { ProfileUpdate } from "../../../common/util/tracker/trackerSendChange";
import { SendProfileModification } from "../../util/outgoingCommunications";

async function ExecuteSendProfileModification(
  reservations: (ReservationAtHotel | null)[],
  profileUrl: string,
  fieldOptions: ProfileUpdate
): Promise<void> {
  const reservationsWithProfile = reservations
    .filter(NotEmptyItem)
    .filter(
      (reservation) => reservation !== null && reservation.owner === profileUrl
    );

  if (reservationsWithProfile.length === 0) {
    ShowWarningSnackbar(
      `No reservations found whose owner is the profile ${profileUrl}`
    );
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
    profileUrl: string;
    fieldOptions: ProfileUpdate;
  }
>((props, ref) => {
  const { items: reservations, isError } = useReservations(ReservationsUrl);

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
        props.profileUrl,
        props.fieldOptions
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
