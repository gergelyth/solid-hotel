import {
  CircularProgress,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import { SetGlobalDialog } from "../global-dialog";
import { useGuest } from "../../hooks/useGuest";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function ApproveSendChangeDialog({
  changedFieldRdf,
}: {
  changedFieldRdf: string;
}): JSX.Element {
  const rdfFields = [
    personFieldToRdfMap.firstName,
    personFieldToRdfMap.lastName,
    changedFieldRdf,
  ];

  const { guestFields, isLoading, isError } = useGuest(rdfFields);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !guestFields) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  const firstName = guestFields.find(
    (x) => x.rdfName == personFieldToRdfMap.firstName
  );
  const lastName = guestFields.find(
    (x) => x.rdfName == personFieldToRdfMap.lastName
  );
  const changedField = guestFields.find((x) => x.rdfName == changedFieldRdf);

  return (
    <Dialog onClose={() => SetGlobalDialog(null)} open={true}>
      <DialogTitle id="popup-title">Send profile change</DialogTitle>
      <Box m={2} p={2}>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography>
              {firstName?.fieldValue} {lastName?.fieldValue}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              There were some modifications in your local profile.
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              Would you like to update the following field in your Pod as well?
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              <Box fontWeight="fontWeightBold" fontStyle="underlined">
                {changedField?.fieldPrettyName}
              </Box>
            </Typography>
          </Grid>
          <Grid item>
            <Typography>New value: {changedField?.fieldValue}</Typography>
          </Grid>

          <Grid item>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  SetGlobalDialog(null);
                  //TODO
                  //   DeleteNotification(notificationUrl);
                }}
              >
                No
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={"button"}
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  SetGlobalDialog(null);
                  //TODO send the change notification
                  //   DeleteNotification(notificationUrl);
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default ApproveSendChangeDialog;
