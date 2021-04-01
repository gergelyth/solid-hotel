import { useGuest } from "../../common/hooks/useGuest";
import { Guest, IdDocumentType } from "../../common/types/Guest";
import ProfileField from "./profile-field";
import { Grid, Typography, Container, Box } from "@material-ui/core";

type Field = {
  fieldName: string;
  fieldValue: string | null;
  setFieldValue: (newValue: string) => void;
};

// TODO: perhaps find something more general for this - probably with Object.entries(guest)
function GetFields(guest: Guest): Field[] {
  return [
    {
      fieldName: "First name",
      fieldValue: guest.firstName,
      setFieldValue: (newValue) => {
        guest.firstName = newValue;
      },
    },
    {
      fieldName: "Last name",
      fieldValue: guest.lastName,
      setFieldValue: (newValue) => {
        guest.lastName = newValue;
      },
    },
    {
      fieldName: "Nationality",
      fieldValue: guest.nationality,
      setFieldValue: (newValue) => {
        guest.nationality = newValue;
      },
    },
    {
      fieldName: "Email",
      fieldValue: guest.email,
      setFieldValue: (newValue) => {
        guest.email = newValue;
      },
    },
    {
      fieldName: "Phone number",
      fieldValue: guest.phoneNumber,
      setFieldValue: (newValue) => {
        guest.phoneNumber = newValue;
      },
    },
    {
      fieldName: "ID document type",
      fieldValue: IdDocumentType[guest.idDocument?.idDocumentType],
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentType =
          IdDocumentType[newValue as keyof typeof IdDocumentType];
      },
    },
    {
      fieldName: "ID document number",
      fieldValue: guest.idDocument?.idDocumentNumber,
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentNumber = newValue;
      },
    },
    {
      fieldName: "ID document expiry",
      fieldValue: guest.idDocument?.idDocumentExpiry.toDateString(),
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentExpiry = new Date(newValue);
      },
    },
  ];
}

function CreateFieldElements(guest: Guest): JSX.Element {
  const fieldElements = GetFields(guest);
  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {fieldElements.map((item) => {
        return ProfileField(item);
      })}
    </Grid>
  );
}

function ProfileMain(): JSX.Element {
  const { guest, isLoading, isError } = useGuest();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (isError || !guest) {
    return (
      <Container maxWidth="sm">
        <Typography>Error retrieving guest data.</Typography>
        <Box>{isError}</Box>
      </Container>
    );
  }

  return (
    <Box>
      <h2>
        {guest.firstName} {guest.lastName}
      </h2>
      {/* <div>{guest["firstName"]}</div> */}
      {CreateFieldElements(guest)}
    </Box>
  );
}

export default ProfileMain;
