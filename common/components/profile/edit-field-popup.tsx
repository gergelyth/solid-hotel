import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
  Button,
} from "@material-ui/core";
import { FieldInputElementBasedOnType } from "./input-type-elements";
import { Field } from "../../types/Field";

/**
 * Returns a dialog which enables the user to edit the requested field.
 * If confirmed, it executes the edit. If the dialog is closed, no action is carried out.
 * @returns A dialog with the option to edit the field or back out. The input type is determined based on the type of the field value.
 */
export function EditFieldPopup({
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
        Edit field:
        <Box fontWeight="fontWeightBold">
          <Typography>{field.fieldPrettyName}</Typography>
        </Box>
      </DialogTitle>
      <Container maxWidth="sm">
        <FieldInputElementBasedOnType
          field={field}
          currentFieldValue={currentFieldValue}
          setFieldValue={setFieldValue}
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
            data-testid="edit-field-popup-button"
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
