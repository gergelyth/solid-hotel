import {
  Grid,
  Typography,
  Box,
  Card,
  CircularProgress,
} from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { forwardRef, useEffect, useState } from "react";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import { Field } from "../../types/Field";
import { CloseSnackbar } from "../snackbar";
import { SendChangeActionButtons } from "./action-buttons";
import { useCustomSnackbarStyles } from "../custom-progress-snackbar";
import { FieldValueChange } from "../../util/tracker/util";
import { ValueChangeComponent } from "./value-change-component";
import { ProfileChangeStrings } from "../../util/tracker/profileChangeStrings";
import { CalculateChanges } from "../../util/tracker/defineChanges";

/** A helper type mapping the RDF name of the personal information field to its approval status and the new value. */
export type ProfileUpdate = {
  [rdfName: string]: { status: boolean; newValue: string };
};

/**
 * Determines the display text of the header.
 * It's either the name of the guest whose profile the change is related to (if available) or the hotel WebId.
 * @returns A header component with the name of the current stakeholder in question.
 */
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
    (x) => x.rdfName == PersonFieldToRdfMap.firstName
  );
  const lastName = oldGuestFields?.find(
    (x) => x.rdfName == PersonFieldToRdfMap.lastName
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

/**
 * Creates the instruction component which guides to user to the appropriate action.
 * @returns A text component containing the instruction.
 */
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

/**
 * @returns A helper text component displayed while the profile changes are determined in the background.
 */
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

/**
 * @returns A helper loading icon component displayed while the profile changes are determined in the background.
 */
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

/**
 * Creates the radio components with the option to either keep or update the fields for which a change was received.
 * @returns An array of elements providing the options update the given field or not.
 */
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

/**
 * A snackbar component reacting to a change made in the guest's profile field.
 * Used in two circumstances:
 * 1. The user performs a change in at least one field in the Solid Pod which we identify with a WebSocket update. In this case oldFields represent the values in cache, while newValues get
 * populated from the current state of the Solid Pod.
 * 2. We receive a notification that the counterparty performed a change in one of the fields. This case newChangeValues is populated and we set oldFields to equal the current guestFields
 * retrieved from the Pod.
 * After these variables are determined, we compare the set of fields and determine which field (RDF name) changed and from what value to what.
 * The snackbar displays these fields (besides some accompanying information) and provides a radio option to either update the specific fields with the new value or keep the current one.
 * @returns A snackbar behaving as described above.
 */
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
        //TODO isn't this just null coalesce ??
        props.oldFields ? props.oldFields() : undefined,
        props.newValues
      );

      return;
    }

    setIsLoading(false);

    if (isSendButtonDisabled === undefined) {
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
              approveButtonAction={() => {
                props.approveButtonFunction(fieldOptions);
                CloseSnackbar(props.snackbarId);
              }}
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
