import { Box, Button } from "@material-ui/core";
import { useState } from "react";
import EditFieldPopup from "../../../common/components/profile/edit-field-popup";

function OnConfirmation(fieldName: string, fieldValue: string): void {
  console.log();
}

function OfflineCheckinButton(): JSX.Element {
  const [isNationalityPopupShowing, setNationalityPopupVisibility] = useState(
    false
  );
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
        fieldName="Nationality"
        fieldValue=""
        onConfirmation={OnConfirmation}
        isPopupShowing={isNationalityPopupShowing}
        setPopupVisibility={setNationalityPopupVisibility}
      />
    </Box>
  );
}

export default OfflineCheckinButton;
