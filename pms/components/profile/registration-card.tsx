import ProfileMain from "../../../common/components/profile/profile-main";
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  Box,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import PrintIcon from "@material-ui/icons/Print";

export function RegistrationCard({
  rdfFields,
  webId,
  isPopupShowing,
  setPopupVisibility,
}: {
  rdfFields: string[] | undefined;
  webId: string;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      open={isPopupShowing}
      fullWidth
    >
      <DialogTitle id="popup-title">Registration card</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="stretch"
          direction="column"
        >
          <Grid item>
            <ProfileMain
              rdfFields={rdfFields}
              webId={webId}
              editable={false}
              deletable={false}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Date: {new Date().toDateString()}
            </Typography>
          </Grid>
          <Grid
            item
            container
            spacing={3}
            justify="center"
            alignItems="center"
            direction="row"
          >
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                ...............................................
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                ...............................................
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={3}
            justify="center"
            alignItems="center"
            direction="row"
          >
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                Guest
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                Hotel employee
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                className={"button"}
                startIcon={<PrintIcon />}
                onClick={() => {
                  //TODO print it
                  setPopupVisibility(false);
                }}
              >
                Print
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
