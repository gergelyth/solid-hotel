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

function CreateFieldElements(guestFields: Field[]): JSX.Element {
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {guestFields.map((item) => {
        return <ProfileField key={item.fieldShortName} field={item} />;
      })}
    </Grid>
  );
}

function ProfileMain({
  rdfFields,
}: {
  rdfFields: string[] | undefined;
}): JSX.Element {
  const { guestFields, isLoading, isError } = useGuest(rdfFields);

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
      {CreateFieldElements(guestFields)}
    </Box>
  );
}

export default ProfileMain;
