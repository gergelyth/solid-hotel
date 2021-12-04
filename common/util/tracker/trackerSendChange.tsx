import {
  Grid,
  Typography,
  Box,
  Card,
  CircularProgress,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useGuest } from "../../hooks/useGuest";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { HotelProfileCache } from "./profileCache";
import { Field } from "../../types/Field";
import { CloseSnackbar } from "../../components/snackbar";
import { SendChangeActionButtons } from "./actionButtons";
import { useCustomSnackbarStyles } from "../../components/custom-progress-snackbar";
import { FieldValueChange, FindChangedFields } from "./util";
import { ValueChangeComponent } from "./valueChangeComponent";

function GetChangeElements(
  firstName: Field | undefined,
  lastName: Field | undefined,
  changedFields: FieldValueChange[],
  fieldOptions: { [rdfName: string]: boolean },
  setFieldOptions: Dispatch<
    SetStateAction<{
      [rdfName: string]: boolean;
    }>
  >,
  setSendButtonDisabled: Dispatch<SetStateAction<boolean | undefined>>
): JSX.Element[] {
  const changeValue = (rdfName: string, newValue: boolean): void => {
    fieldOptions[rdfName] = newValue;
    setFieldOptions(fieldOptions);
    const asdf = Object.entries(fieldOptions).every((option) => !option[1]);
    console.log("called");

    setSendButtonDisabled(asdf);
  };
  const changes = changedFields.map((changeField) => (
    <ValueChangeComponent
      key={changeField.name}
      fieldValueChange={changeField}
      optionValue={fieldOptions[changeField.rdfName]}
      setOptionValue={changeValue}
    />
  ));

  return [
    <Grid item key="name">
      <Typography>
        Profile of {firstName?.fieldValue} {lastName?.fieldValue}
      </Typography>
    </Grid>,

    <Grid item key="instruction">
      <Typography>
        Would you like to update the following field in your Pod as well?
      </Typography>
    </Grid>,

    ...changes,
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
  const classes = useCustomSnackbarStyles();
  const { guestFields, isLoading, isError } = useGuest(
    props.rdfFields,
    props.profileUrl
  );

  const [retrievalElements, setRetrievalElements] = useState<JSX.Element[]>([]);
  const [fieldOptions, setFieldOptions] = useState<{
    [rdfName: string]: boolean;
  }>({});
  const [isSendButtonDisabled, setSendButtonDisabled] = useState<boolean>();

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

    const fieldOptionsTemp: { [rdfName: string]: boolean } = {};
    changedFields.forEach(
      (changedField) => (fieldOptionsTemp[changedField.rdfName] = true)
    );
    setFieldOptions(fieldOptionsTemp);

    setRetrievalElements(
      GetChangeElements(
        firstName,
        lastName,
        changedFields,
        fieldOptions,
        setFieldOptions,
        setSendButtonDisabled
      )
    );
    setSendButtonDisabled(false);
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
            <SendChangeActionButtons
              isSendButtonDisabled={isSendButtonDisabled}
              fieldOptions={fieldOptions}
            />
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

SendChangeSnackbar.displayName = "SendChangeSnackbar";

export default SendChangeSnackbar;
