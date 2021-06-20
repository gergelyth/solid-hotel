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
import { DeserializeProfileModification } from "../../notifications/ProfileModification";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { getSourceUrl, SolidDataset } from "@inrupt/solid-client";
import { SetField } from "../../util/solid";
import { DeleteNotification } from "../../util/notifications";

function ApproveChangeDialog({
  dataset,
}: {
  dataset: SolidDataset;
}): JSX.Element {
  const { webId, fieldModified, newFieldValue } =
    DeserializeProfileModification(dataset);

  const rdfFields = [
    personFieldToRdfMap.firstName,
    personFieldToRdfMap.lastName,
    fieldModified,
  ];

  const { guestFields, isLoading, isError } = useGuest(rdfFields, webId);

  if (isLoading) {
    return <CircularProgress />;
  }

  const notificationUrl = getSourceUrl(dataset);

  if (isError || !guestFields || !notificationUrl) {
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
  const changedField = guestFields.find((x) => x.rdfName == fieldModified);

  return (
    <Dialog onClose={() => SetGlobalDialog(null)} open={true}>
      <DialogTitle id="popup-title">Approve propagation</DialogTitle>
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
              There were some modifications in the counterparty&apos;s saved
              copy of your profile.
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
            <Typography>Old value: {changedField?.fieldValue}</Typography>
          </Grid>
          <Grid item>
            <Typography>New value: {newFieldValue}</Typography>
          </Grid>

          <Grid item>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  SetGlobalDialog(null);
                  DeleteNotification(notificationUrl);
                }}
              >
                No
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={"button"}
                //TODO approve icon?
                onClick={() => {
                  SetGlobalDialog(null);
                  SetField(
                    personFieldToRdfMap[fieldModified],
                    newFieldValue,
                    webId
                  );
                  DeleteNotification(notificationUrl);
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

export default ApproveChangeDialog;
