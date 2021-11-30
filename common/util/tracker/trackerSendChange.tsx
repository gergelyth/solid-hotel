import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useGuest } from "../../hooks/useGuest";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { HotelProfileCache } from "./profileCache";
import { Field } from "../../types/Field";

//TODO this is the same style as CustomProgressSnackbar - unify this
const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  card: {
    width: "100%",
  },
}));

type FieldValueChange = { name: string; oldValue: string; newValue: string };

function FindChangedFields(
  cachedFields: Field[],
  newFields: Field[]
): FieldValueChange[] {
  const changedFields: FieldValueChange[] = [];

  newFields.forEach((newField) => {
    const cachedField = cachedFields.find(
      (x) => x.rdfName === newField.rdfName
    );
    if (!cachedField) {
      return;
    }

    if (cachedField.fieldValue !== newField.fieldValue) {
      changedFields.push({
        name: cachedField.fieldPrettyName,
        //TODO change default value
        oldValue: cachedField.fieldValue ?? "",
        newValue: newField.fieldValue ?? "",
      });
    }
  });

  return changedFields;
}

function ValueChangeComponent({
  fieldValueChange,
}: {
  fieldValueChange: FieldValueChange;
}): JSX.Element {
  return (
    <Typography>
      <Box fontWeight="fontWeightBold" fontStyle="underlined">
        {fieldValueChange.name}
      </Box>
      <Typography>
        {fieldValueChange.oldValue} -&gt; {fieldValueChange.newValue}
      </Typography>
    </Typography>
  );
}

const SendChangeSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    profileUrl: string;
    rdfFields: string[];
  }
>((props, ref) => {
  const classes = useStyles();
  const { guestFields, isLoading, isError } = useGuest(
    props.rdfFields,
    props.profileUrl
  );

  //TODO probably put all this info useEffect as there seem to be many calls to hooks

  console.log("Old guest");
  const cachedFields = HotelProfileCache[props.profileUrl];
  console.log(cachedFields);

  if (isLoading) {
    return (
      <SnackbarContent ref={ref} className={classes.root} key={props.key}>
        <Card className={classes.card} raised>
          <Box m={2} p={2}>
            <CircularProgress />
          </Box>
        </Card>
      </SnackbarContent>
    );
  }

  if (isError || !guestFields) {
    return (
      <SnackbarContent ref={ref} className={classes.root} key={props.key}>
        <Card className={classes.card} raised>
          <Box m={2} p={2}>
            <Container maxWidth="sm">
              <Typography>An error occurred.</Typography>
              <Typography>{isError}</Typography>
            </Container>
          </Box>
        </Card>
      </SnackbarContent>
    );
  }

  console.log("New guest");
  console.log(guestFields);

  const firstName = cachedFields.find(
    (x) => x.rdfName == personFieldToRdfMap.firstName
  );
  const lastName = cachedFields.find(
    (x) => x.rdfName == personFieldToRdfMap.lastName
  );

  const changedFields = FindChangedFields(cachedFields, guestFields);
  console.log(changedFields);

  return (
    <SnackbarContent ref={ref} className={classes.root} key={props.key}>
      <Card className={classes.card} raised>
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
                Would you like to update the following field in your Pod as
                well?
              </Typography>
            </Grid>
            {changedFields.map((changeField) => (
              <Grid item key={changeField.name}>
                <ValueChangeComponent fieldValueChange={changeField} />
              </Grid>
            ))}

            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  //TODO
                }}
              >
                No
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={"button"}
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  //TODO send the change notification
                }}
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

SendChangeSnackbar.displayName = "SendChangeSnackbar";

export default SendChangeSnackbar;
