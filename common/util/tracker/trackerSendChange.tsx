import {
  Grid,
  Typography,
  Box,
  Card,
  CircularProgress,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { forwardRef, useEffect, useState } from "react";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { Field } from "../../types/Field";
import { CloseSnackbar } from "../../components/snackbar";
import { SendChangeActionButtons } from "./actionButtons";
import { useCustomSnackbarStyles } from "../../components/custom-progress-snackbar";
import { FieldValueChange } from "./util";
import { ValueChangeComponent } from "./valueChangeComponent";
import { ProfileChangeStrings } from "./profileChangeStrings";
import { CalculateChanges } from "./defineChanges";

export type ProfileUpdate = {
  [rdfName: string]: { status: boolean; newValue: string };
};

function GetChangeElements(
  firstName: Field | undefined,
  lastName: Field | undefined,
  changedFields: FieldValueChange[],
  fieldOptions: ProfileUpdate,
  changeOptionValue: (rdfName: string, newValue: boolean) => void,
  requiresApproval: boolean,
  profileChangeStrings: ProfileChangeStrings,
  hotelUrl: string | undefined
): JSX.Element[] {
  const changes = changedFields.map((changeField) => (
    <ValueChangeComponent
      key={changeField.name}
      fieldValueChange={changeField}
      optionValue={fieldOptions[changeField.rdfName]?.status}
      setOptionValue={changeOptionValue}
      requiresApproval={requiresApproval}
      profileChangeStrings={profileChangeStrings}
    />
  ));

  const title = hotelUrl
    ? `Hotel: ${hotelUrl}`
    : `Profile of ${firstName?.fieldValue} ${lastName?.fieldValue}`;

  return [
    <Grid item key="name">
      <Typography>{title}</Typography>
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
    approveButtonFunction: (fieldOptions: ProfileUpdate) => void;
    oldFields?: () => Field[];
    newValues?: {
      [rdfName: string]: string;
    };
    closeActionCallback?: () => void;
    hotelUrl?: string;
  }
>((props, ref) => {
  const classes = useCustomSnackbarStyles();

  const [retrievalElements, setRetrievalElements] = useState<JSX.Element[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ProfileUpdate>({});
  const [isSendButtonDisabled, setSendButtonDisabled] = useState<boolean>();
  const [changedFields, setChangedFields] = useState<FieldValueChange[]>();
  const [oldGuestFields, setOldGuestFields] = useState<Field[]>();

  const changeOptionValue = (rdfName: string, newValue: boolean): void => {
    fieldOptions[rdfName].status = newValue;
    setFieldOptions(fieldOptions);
    setSendButtonDisabled(
      Object.entries(fieldOptions).every((option) => !option[1])
    );
  };

  useEffect(() => {
    if (!changedFields) {
      CalculateChanges(
        props.profileUrl,
        props.rdfFields,
        setChangedFields,
        setOldGuestFields,
        props.oldFields ? props.oldFields() : undefined,
        props.newValues
      );

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

    console.log("Logic entered");
    const firstName = oldGuestFields?.find(
      (x) => x.rdfName == personFieldToRdfMap.firstName
    );
    const lastName = oldGuestFields?.find(
      (x) => x.rdfName == personFieldToRdfMap.lastName
    );

    //TODO if no changedFields, display "No changes" and return (e.g. if the guest's profile was modified, it may not have a been a watched field)

    const fieldOptionsTemp: ProfileUpdate = {};
    changedFields.forEach(
      (changedField) =>
        (fieldOptionsTemp[changedField.rdfName] = {
          status: true,
          newValue: changedField.newValue,
        })
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
        props.profileChangeStrings,
        props.hotelUrl
      )
    );
    setSendButtonDisabled(false);
  }, [changedFields]);

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
              approveButtonAction={() =>
                props.approveButtonFunction(fieldOptions)
              }
              closeSnackbar={() => {
                CloseSnackbar(props.key);
                if (props.closeActionCallback) props.closeActionCallback();
              }}
            />
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

SendChangeSnackbar.displayName = "SendChangeSnackbar";

export default SendChangeSnackbar;
