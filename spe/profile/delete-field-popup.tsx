import {
  Typography,
  Dialog,
  DialogTitle,
  Container,
  DialogActions,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Dispatch, SetStateAction } from "react";

function DeleteFieldPopup({
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
        <Typography>
          <strong>{fieldName}</strong>
        </Typography>
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

export default DeleteFieldPopup;
