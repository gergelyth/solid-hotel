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

function Header({
  oldGuestFields,
  hotelUrl,
  disabled,
}: {
  oldGuestFields: Field[] | undefined;
  hotelUrl: string | undefined;
  disabled: boolean;
}): JSX.Element | null {
  if (disabled) {
    return null;
  }

  //It's possible to not have these, since we try to retrieve the minimal amount of information for the guest.
  //If we don't, we don't display the name.
  const firstName = oldGuestFields?.find(
    (x) => x.rdfName == personFieldToRdfMap.firstName
  );
  const lastName = oldGuestFields?.find(
    (x) => x.rdfName == personFieldToRdfMap.lastName
  );

  const profileName =
    firstName?.fieldValue || lastName?.fieldValue
      ? `Profile of ${firstName?.fieldValue ?? ""} ${
          lastName?.fieldValue ?? ""
        }`
      : "";

  const title = hotelUrl ? `Hotel: ${hotelUrl}` : profileName;

  return (
    <Grid item key="name">
      <Typography>{title}</Typography>
    </Grid>
  );
}

function InstructionText({
  instruction,
  disabled,
}: {
  instruction: string;
  disabled: boolean;
}): JSX.Element | null {
  if (disabled) {
    return null;
  }

  return (
    <Grid item key="instruction">
      <Typography>{instruction}</Typography>
    </Grid>
  );
}

function LoadingText({ disabled }: { disabled: boolean }): JSX.Element | null {
  if (disabled) {
    return null;
  }

  return (
    <Grid item key="loadingtag">
      <Typography>Loading results</Typography>
    </Grid>
  );
}

function LoadingIcon({ disabled }: { disabled: boolean }): JSX.Element | null {
  if (disabled) {
    return null;
  }

  return (
    <Grid item key="progress">
      <CircularProgress />
    </Grid>
  );
}

function ChangeElements(
  changedFields: FieldValueChange[] | undefined,
  fieldOptions: ProfileUpdate,
  changeOptionValue: (rdfName: string, newValue: boolean) => void,
  requiresApproval: boolean,
  profileChangeStrings: ProfileChangeStrings,
  disabled: boolean
): JSX.Element[] | null {
  if (disabled || !changedFields) {
    return null;
  }

  return changedFields.map((changeField) => (
    <ValueChangeComponent
      key={changeField.name}
      fieldValueChange={changeField}
      optionValue={fieldOptions[changeField.rdfName]?.status}
      setOptionValue={changeOptionValue}
      requiresApproval={requiresApproval}
      profileChangeStrings={profileChangeStrings}
    />
  ));
}

const SendChangeSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarId: string | number;
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

  const [fieldOptions, setFieldOptions] = useState<ProfileUpdate>({});
  const [isSendButtonDisabled, setSendButtonDisabled] = useState<boolean>();
  const [changedFields, setChangedFields] = useState<FieldValueChange[]>();
  const [oldGuestFields, setOldGuestFields] = useState<Field[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const changeOptionValue = (rdfName: string, newValue: boolean): void => {
    fieldOptions[rdfName].status = newValue;
    setFieldOptions(fieldOptions);
    setSendButtonDisabled(
      Object.entries(fieldOptions).every((option) => !option[1].status)
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

      return;
    }

    console.log("Logic entered");
    setIsLoading(false);

    if (isSendButtonDisabled === undefined) {
      console.log("setting field options");
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
      setSendButtonDisabled(false);

      return;
    }

    if (!props.requiresApproval) {
      console.log("Approval not required, executing action automatically");
      props.approveButtonFunction(fieldOptions);
    }
  }, [changedFields, fieldOptions]);

  return (
    <SnackbarContent ref={ref} className={classes.root} key={props.snackbarId}>
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
            <LoadingText disabled={!isLoading} />
            <LoadingIcon disabled={!isLoading} />
            <Header
              oldGuestFields={oldGuestFields}
              hotelUrl={props.hotelUrl}
              disabled={isLoading}
            />
            <InstructionText
              instruction={props.profileChangeStrings.instruction}
              disabled={isLoading}
            />

            {ChangeElements(
              changedFields,
              fieldOptions,
              changeOptionValue,
              props.requiresApproval,
              props.profileChangeStrings,
              !changedFields
            )}

            <SendChangeActionButtons
              isSendButtonDisabled={isSendButtonDisabled}
              requiresApproval={props.requiresApproval}
              label={props.profileChangeStrings.approveButtonText}
              approveButtonAction={() =>
                props.approveButtonFunction(fieldOptions)
              }
              closeSnackbar={() => {
                CloseSnackbar(props.snackbarId);
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
