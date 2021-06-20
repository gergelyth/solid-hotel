import { Box, Button } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import EditFieldPopup from "../../../common/components/profile/edit-field-popup";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { FieldNameToFieldMap } from "../../../common/util/fields";

function OnConfirmation(
  reservation: ReservationAtHotel,
  nationality: string,
  router: NextRouter
): void {
  //nationality gets parsed in RequiredFieldsAtCheckin
  router.push({
    pathname: "/checkin",
    query: { id: reservation.id, nationality: nationality },
  });
}

function OfflineCheckinButton({
  reservation,
}: {
  reservation: ReservationAtHotel;
}): JSX.Element {
  const router = useRouter();

  const [isNationalityPopupShowing, setNationalityPopupVisibility] =
    useState(false);

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setNationalityPopupVisibility(true);
        }}
      >
        Check-in
      </Button>
      <EditFieldPopup
        field={FieldNameToFieldMap["nationality"]}
        onConfirmation={(nationalityFieldName: string, nationality: string) =>
          OnConfirmation(reservation, nationality, router)
        }
        isPopupShowing={isNationalityPopupShowing}
        setPopupVisibility={setNationalityPopupVisibility}
      />
    </Box>
  );
}

export default OfflineCheckinButton;
