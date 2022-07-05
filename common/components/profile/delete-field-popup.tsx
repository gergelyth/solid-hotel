import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  Container,
  DialogActions,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Dispatch, SetStateAction } from "react";

/**
 * Returns a dialog which enables the user to confirm their decision to delete the requested field.
 * If confirmed, executes the deletion.
 * If the dialog is closed, no action is carried out.
 * @returns A dialog with the option to delete the field or back out.
 */
export function DeleteFieldPopup({
  fieldName,
  onConfirmation,
  isPopupShowing,
  setPopupVisibility,
}: {
  fieldName: string;
  onConfirmation: (fieldName: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  if (!isPopupShowing) {
    return null;
  }

  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      aria-labelledby="popup-title"
      open={isPopupShowing}
    >
      <DialogTitle id="popup-title">Delete field</DialogTitle>
      <Container maxWidth="sm">
        <Typography>Delete the following field?</Typography>
        <Box fontWeight="fontWeightBold">
          <Typography>{fieldName}</Typography>
        </Box>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPopupVisibility(false)}
          >
            Back
          </Button>
          <Button
            data-testid="delete-field-popup-button"
            variant="contained"
            color="primary"
            className={"button"}
            startIcon={<DeleteIcon />}
            onClick={() => {
              onConfirmation(fieldName);
              setPopupVisibility(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Container>
    </Dialog>
  );
}
