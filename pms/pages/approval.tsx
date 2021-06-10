import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { useGuest } from "../../common/hooks/useGuest";
import { DeserializeProfileModification } from "../../common/notifications/ProfileModification";
import { personFieldToRdfMap } from "../../common/vocabularies/rdf_person";

function ProfileApproval(): JSX.Element {
  //TODO get notification URL from POST request
  //TODO parse the notification dataset
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
  const changedField = guestFields.find((x) => x.rdfName == fieldModified);

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">
          {firstName?.fieldValue} {lastName?.fieldValue}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          There were some modifications in the counterparty&apos;s saved copy of
          your profile.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Would you like to update the following field in your Pod as well?
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">{changedField?.fieldPrettyName}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2">
          Old value: {changedField?.fieldValue}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2">New value: {newFieldValue}</Typography>
      </Grid>
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="row"
      >
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={
              //TODO delete notification from pod
            }
          >
            No
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={
              //TODO update value
            }
          >
            Yes
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfileApproval;
