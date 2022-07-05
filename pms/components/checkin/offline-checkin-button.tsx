import { Box, Button } from "@material-ui/core";
import { NextRouter, useRouter } from "next/router";
import { useState } from "react";
import { EditFieldPopup } from "../../../common/components/profile/edit-field-popup";
import { HotelProfilesUrl } from "../../../common/consts/solidIdentifiers";
import GetSupportedFields from "../../../common/consts/supported-fields";
import { Field } from "../../../common/types/Field";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { CreateHotelProfile } from "../../../common/util/hotelProfileHandler";

function OnConfirmation(
  reservation: ReservationAtHotel,
  nationalityField: Field,
  nationality: string,
  router: NextRouter
): void {
  nationalityField.fieldValue = nationality;

  CreateHotelProfile([nationalityField], HotelProfilesUrl).then(
    (hotelProfileId) => {
      router.push({
        pathname: "/checkin",
        query: {
          id: reservation.id,
          nationality: nationality,
          hotelProfile: hotelProfileId,
        },
      });
    }
  );

  //TODO some indiciation that we're waiting for the hotel profile creation?
  // if (!hotelProfileWebId) {
  //   return <CircularProgress />;
  // }
}

function OfflineCheckinButton({
  reservation,
}: {
  reservation: ReservationAtHotel;
}): JSX.Element {
  const router = useRouter();

  const [isNationalityPopupShowing, setNationalityPopupVisibility] =
    useState(false);

  const nationalityField = GetSupportedFields().find(
    (x) => x.fieldShortName == "nationality"
  );
  if (!nationalityField) {
    throw new Error("Nationality field not in supported fields list");
  }

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
        field={nationalityField}
        onConfirmation={(nationalityFieldName: string, nationality: string) =>
          OnConfirmation(reservation, nationalityField, nationality, router)
        }
        isPopupShowing={isNationalityPopupShowing}
        setPopupVisibility={setNationalityPopupVisibility}
      />
    </Box>
  );
}

export default OfflineCheckinButton;
