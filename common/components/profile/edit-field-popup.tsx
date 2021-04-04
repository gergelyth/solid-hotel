import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
  Button,
} from "@material-ui/core";
import { GetFieldInputElementBasedOnType } from "./input-type-elements";
import { Field } from "../../types/Field";

function EditFieldPopup({
  field,
  onConfirmation,
  isPopupShowing,
  setPopupVisibility,
}: {
  field: Field;
  onConfirmation: (fieldName: string, newValue: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [currentFieldValue, setFieldValue] = useState(
    field.fieldValue ?? undefined
  );
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
        Edit field: <strong>{field.fieldPrettyName}</strong>
      </DialogTitle>
      <Container maxWidth="sm">
        {GetFieldInputElementBasedOnType(
          field,
          currentFieldValue,
          setFieldValue
        )}
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
            disabled={!currentFieldValue}
            onClick={() => {
              if (!currentFieldValue) {
                throw new Error(
                  "Button should be disabled, as current field value is undefined!"
                );
              }
              onConfirmation(field.fieldShortName, currentFieldValue);
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
