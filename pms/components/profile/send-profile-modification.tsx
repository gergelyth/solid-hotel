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

async function SendProfileModification(
  reservations: (ReservationAtHotel | null)[],
  profileUrl: string,
  fieldOptions: { [rdfName: string]: boolean }
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
}

const SendProfileModificationSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    profileUrl: string;
    fieldOptions: { [rdfName: string]: boolean };
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

    SendProfileModification(
      reservations,
      props.profileUrl,
      props.fieldOptions
    ).then(() => CloseSnackbar(props.key));
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
