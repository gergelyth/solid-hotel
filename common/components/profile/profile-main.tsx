import { useGuest } from "../../hooks/useGuest";
import ProfileField from "./profile-field";
import {
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { Field } from "../../types/Field";

function CreateFieldElements(
  guestFields: Field[],
  rdfFields: string[] | undefined,
  editable: boolean,
  deletable: boolean
): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {guestFields.map((item) => {
        return (
          <ProfileField
            key={item.fieldShortName}
            field={item}
            guestFields={guestFields}
            rdfFields={rdfFields}
            editable={editable}
            deletable={deletable}
          />
        );
      })}
    </Grid>
  );
}

function ProfileMain({
  rdfFields,
  webId,
  editable = true,
  deletable = true,
}: {
  rdfFields: string[] | undefined;
  webId?: string;
  editable?: boolean;
  deletable?: boolean;
}): JSX.Element {
  const { guestFields, isLoading, isError } = useGuest(rdfFields, webId);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !guestFields) {
    return (
      <Container maxWidth="sm">
        <Typography>Error retrieving guest data.</Typography>
        <Box>{isError}</Box>
      </Container>
    );
  }

  return (
    <Box>
      <h2>{/* {guest.firstName} {guest.lastName} */}</h2>
      {/* <div>{guest["firstName"]}</div> */}
      {CreateFieldElements(guestFields, rdfFields, editable, deletable)}
    </Box>
  );
}

export default ProfileMain;
