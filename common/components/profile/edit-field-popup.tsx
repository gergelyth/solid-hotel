import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
  TextField,
  Button,
} from "@material-ui/core";

function EditFieldPopup({
  fieldName,
  fieldValue,
  onConfirmation,
  isPopupShowing,
  setPopupVisibility,
}: {
  fieldName: string;
  fieldValue: string | null;
  onConfirmation: (fieldName: string, newValue: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [currentFieldValue, setFieldValue] = useState(fieldValue ?? "");
  if (!isPopupShowing) {
    return null;
  }

  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      aria-labelledby="popup-title"
      open={isPopupShowing}
    >
      <DialogTitle id="popup-title">
        Edit field: <strong>{fieldName}</strong>
      </DialogTitle>
      <Container maxWidth="sm">
        <TextField
          required
          id="editInput"
          label={fieldName}
          variant="outlined"
          value={currentFieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPopupVisibility(false)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={"button"}
            onClick={() => {
              onConfirmation(fieldName, currentFieldValue);
              setPopupVisibility(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Container>
    </Dialog>
  );
}

export default EditFieldPopup;
