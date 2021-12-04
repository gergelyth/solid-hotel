import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CircularProgress,
  ButtonGroup,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef, useEffect, useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useGuest } from "../../hooks/useGuest";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { HotelProfileCache } from "./profileCache";
import { Field } from "../../types/Field";
import { CloseSnackbar } from "../../components/snackbar";

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

function GetChangeElements(
  firstName: Field | undefined,
  lastName: Field | undefined,
  changedFields: FieldValueChange[]
): JSX.Element[] {
  const changes = changedFields.map((changeField) => (
    <Grid item key={changeField.name}>
      <ValueChangeComponent fieldValueChange={changeField} />
    </Grid>
  ));

  return [
    <Grid item key="name">
      <Typography>
        {firstName?.fieldValue} {lastName?.fieldValue}
      </Typography>
    </Grid>,

    <Grid item key="instruction">
      <Typography>
        Would you like to update the following field in your Pod as well?
      </Typography>
    </Grid>,

    ...changes,

    <Grid item key="buttons">
      <ButtonGroup>
        <Box px={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              //TODO
            }}
          >
            Cancel
          </Button>
        </Box>
        <Box px={2}>
          <Button
            variant="contained"
            color="primary"
            className={"button"}
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              //TODO send the change notification
            }}
          >
            Send selected
          </Button>
        </Box>
      </ButtonGroup>
    </Grid>,
  ];
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

  const [retrievalElements, setRetrievalElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isLoading) {
      setRetrievalElements([
        <Grid item key="loadingtag">
          <Typography>Loading results</Typography>
        </Grid>,
        <Grid item key="progress">
          <CircularProgress />
        </Grid>,
      ]);
      return;
    }

    if (isError || !guestFields) {
      setRetrievalElements([
        <Grid item key="error">
          <Typography>An error occurred.</Typography>
          <Typography>{isError}</Typography>
        </Grid>,
      ]);
      CloseSnackbar(props.key);
      //TODO
      throw new Error(`Failed to cache hotel profile ${props.profileUrl}`);
    }

    console.log("Logic entered");
    //TODO default value only for debug
    const cachedFields = HotelProfileCache[props.profileUrl] ?? [
      {
        fieldPrettyName: "Nationality",
        rdfName: "schema:nationality",
        fieldValue: "oldNationality",
        fieldShortName: "nationality",
      },
    ];
    const firstName = cachedFields.find(
      (x) => x.rdfName == personFieldToRdfMap.firstName
    );
    const lastName = cachedFields.find(
      (x) => x.rdfName == personFieldToRdfMap.lastName
    );

    const changedFields = FindChangedFields(cachedFields, guestFields);

    setRetrievalElements(GetChangeElements(firstName, lastName, changedFields));
  }, [guestFields, isLoading, isError]);

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
              <Typography>Changes in a profile detected</Typography>
            </Grid>
            {retrievalElements}
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

SendChangeSnackbar.displayName = "SendChangeSnackbar";

export default SendChangeSnackbar;
