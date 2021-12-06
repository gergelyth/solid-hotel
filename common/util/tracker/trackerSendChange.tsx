import {
  Grid,
  Typography,
  Box,
  Card,
  CircularProgress,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { forwardRef, useEffect, useState } from "react";
import { useGuest } from "../../hooks/useGuest";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { ProfileCache } from "./profileCache";
import { Field } from "../../types/Field";
import { CloseSnackbar, ShowErrorSnackbar } from "../../components/snackbar";
import { SendChangeActionButtons } from "./actionButtons";
import { useCustomSnackbarStyles } from "../../components/custom-progress-snackbar";
import { FieldValueChange, FindChangedFields } from "./util";
import { ValueChangeComponent } from "./valueChangeComponent";
import { ProfileChangeStrings } from "./profileChangeStrings";

function GetChangeElements(
  firstName: Field | undefined,
  lastName: Field | undefined,
  changedFields: FieldValueChange[],
  fieldOptions: { [rdfName: string]: boolean },
  changeOptionValue: (rdfName: string, newValue: boolean) => void,
  requiresApproval: boolean,
  profileChangeStrings: ProfileChangeStrings
): JSX.Element[] {
  const changes = changedFields.map((changeField) => (
    <ValueChangeComponent
      key={changeField.name}
      fieldValueChange={changeField}
      optionValue={fieldOptions[changeField.rdfName]}
      setOptionValue={changeOptionValue}
      requiresApproval={requiresApproval}
      profileChangeStrings={profileChangeStrings}
    />
  ));

  return [
    <Grid item key="name">
      <Typography>
        Profile of {firstName?.fieldValue} {lastName?.fieldValue}
      </Typography>
    </Grid>,

    <Grid item key="instruction">
      <Typography>{profileChangeStrings.instruction}</Typography>
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
    requiresApproval: boolean;
    profileChangeStrings: ProfileChangeStrings;
    approveButtonFunction: (
      fieldOptions: { [rdfName: string]: boolean }
    ) => void;
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

  const changeOptionValue = (rdfName: string, newValue: boolean): void => {
    fieldOptions[rdfName] = newValue;
    setFieldOptions(fieldOptions);
    setSendButtonDisabled(
      Object.entries(fieldOptions).every((option) => !option[1])
    );
  };

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
      ShowErrorSnackbar(`Failed to retrieve guestFields from profile ${props.profileUrl}`);
      return;
    }

    console.log("Logic entered");
    //TODO default value only for debug
    const cachedFields = ProfileCache[props.profileUrl] ?? [
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
        changeOptionValue,
        props.requiresApproval,
        props.profileChangeStrings
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
              <Typography>{props.profileChangeStrings.headline}</Typography>
            </Grid>
            {retrievalElements}
            <SendChangeActionButtons
              isSendButtonDisabled={isSendButtonDisabled}
              requiresApproval={props.requiresApproval}
              label={props.profileChangeStrings.approveButtonText}
              approveButtonAction={() => props.approveButtonFunction(fieldOptions)}
              closeSnackbar={() => CloseSnackbar(props.key)}
            />
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

SendChangeSnackbar.displayName = "SendChangeSnackbar";

export default SendChangeSnackbar;
