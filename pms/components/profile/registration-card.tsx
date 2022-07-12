import { ProfileMain } from "../../../common/components/profile/profile-main";
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  Box,
  DialogActions,
  Button,
} from "@material-ui/core";
import { useRef, Dispatch, SetStateAction } from "react";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";

/**
 * Provides a printable format of the guest's hotel profile.
 * The printing function is performed according to system defaults.
 * @returns A dialog with the print overview and button which triggers the print.
 */
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
  const printComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current ?? null,
  });

  return (
    <Dialog
      onClose={() => setPopupVisibility(false)}
      open={isPopupShowing}
      fullWidth
    >
      <Grid item innerRef={printComponentRef}>
        <Box m={2} p={2}>
          <Grid
            container
            spacing={3}
            justify="center"
            alignItems="stretch"
            direction="column"
          >
            <DialogTitle id="popup-title">Registration card</DialogTitle>
            <Grid item container justify="flex-end">
              <Typography variant="caption" align="center">
                Date: {new Date().toDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <ProfileMain
                rdfFields={rdfFields}
                webId={webId}
                editable={false}
                deletable={false}
                centerJustify={true}
              />
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
          </Grid>
        </Box>
      </Grid>
      <Grid item container justify="center">
        <Box m={1} p={1}>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              className={"button"}
              startIcon={<PrintIcon />}
              onClick={() => {
                if (handlePrint) {
                  handlePrint();
                } else {
                  ShowErrorSnackbar(
                    "Print preparation failed (handlePrint is undefined)"
                  );
                }
                setPopupVisibility(false);
              }}
            >
              Print
            </Button>
          </DialogActions>
        </Box>
      </Grid>
    </Dialog>
  );
}
