import { Dispatch, SetStateAction } from "react";
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Box,
  DialogContent,
} from "@material-ui/core";

/**
 * A sample placeholder Terms of Service component listing some conditions.
 * @returns A components containing sample excerpts from a potential ToC document as well as an acknowledging button closing it.
 */
function TocPopup({
  isPopupShowing,
  setPopupVisibility,
}: {
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  return (
    <Dialog onClose={() => setPopupVisibility(false)} open={isPopupShowing}>
      <DialogTitle id="popup-title">Terms and conditions</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h6">
              <Box fontWeight="fontWeightBold">Paragraph I</Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              <Box mx={3}>
                (I.1.) A copy of your personal information will be created in
                the Solid pod of the hotel. This is to avoid situations, when a
                guest may edit or delete a required field during the critical
                interval between check-in and check-out.
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              <Box mx={3}>
                (I.2.) This data is viewable by hotel employees strictly on a
                need-to-know basis.
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              <Box mx={3}>
                (I.3.) This data (or a part of it) is stored after check-out to
                adhere to data protection legislations.
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPopupVisibility(false)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TocPopup;
