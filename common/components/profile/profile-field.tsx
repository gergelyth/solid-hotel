import { useState } from "react";
import EditFieldPopup from "./edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";
import { RemoveField, SetField } from "../../util/solid_profile";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { Grid, Button, Box, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "../../types/Field";
import { RevalidateGuest, TriggerRefetchGuest } from "../../hooks/useGuest";

function OnEditConfirmation(
  fieldName: string,
  newValue: string,
  fields: Field[],
  rdfFields: string[] | undefined,
  webId?: string
): void {
  fields.forEach((field) => {
    if (field.fieldShortName === fieldName) {
      field.fieldValue = newValue;
    }
  });
  TriggerRefetchGuest(rdfFields, fields, webId);
  SetField(personFieldToRdfMap[fieldName], newValue, webId);
  RevalidateGuest(rdfFields, webId);
}

function OnDeleteConfirmation(
  fieldName: string,
  fields: Field[],
  rdfFields: string[] | undefined,
  webId?: string
): void {
  fields.forEach((field, index) => {
    if (field?.fieldShortName === fieldName) fields.splice(index, 1);
  });
  TriggerRefetchGuest(rdfFields, fields, webId);
  RemoveField(personFieldToRdfMap[fieldName], webId);
  RevalidateGuest(rdfFields, webId);
}

function EditElements({
  field,
  guestFields,
  rdfFields,
  editable,
  forceRender,
  webId,
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  editable: boolean;
  forceRender: () => void;
  webId?: string;
}): JSX.Element | null {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);

  if (!editable) {
    return null;
  }

  return (
    <Box>
      <Grid item xs={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setEditPopupVisibility(true)}
        >
          Edit
        </Button>
      </Grid>
      <EditFieldPopup
        field={field}
        onConfirmation={(fieldName, newValue) => {
          OnEditConfirmation(
            fieldName,
            newValue,
            guestFields,
            rdfFields,
            webId
          );
          forceRender();
        }}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
    </Box>
  );
}

function DeleteElements({
  field,
  guestFields,
  rdfFields,
  deletable,
  forceRender,
  webId,
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  deletable: boolean;
  forceRender: () => void;
  webId?: string;
}): JSX.Element | null {
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);

  if (!deletable) {
    return null;
  }

  return (
    <Box>
      <Grid item xs={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={() => setDeletePopupVisibility(true)}
        >
          Delete
        </Button>
      </Grid>
      <DeleteFieldPopup
        fieldName={field.fieldShortName}
        onConfirmation={(fieldName) => {
          OnDeleteConfirmation(fieldName, guestFields, rdfFields, webId);
          forceRender();
        }}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Box>
  );
}

function ProfileField({
  field,
  guestFields,
  rdfFields,
  editable,
  deletable,
  centerJustify,
  forceRender,
  webId,
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  editable: boolean;
  deletable: boolean;
  centerJustify: boolean;
  forceRender?: () => void;
  webId?: string;
}): JSX.Element {
  const [renderHelper, setRenderHelper] = useState(false);
  const render = (): void => {
    setRenderHelper(!renderHelper);
    if (forceRender) {
      forceRender();
    }
  };

  return (
    <Grid container item spacing={2} justify="center" alignItems="center">
      <Grid item xs={4}>
        <Typography
          variant="body1"
          align={centerJustify ? "center" : "inherit"}
        >
          {field.fieldPrettyName}:
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="body1"
          align={centerJustify ? "center" : "inherit"}
        >
          {field.fieldValue}
        </Typography>
      </Grid>
      <EditElements
        field={field}
        guestFields={guestFields}
        rdfFields={rdfFields}
        editable={editable}
        forceRender={render}
        webId={webId}
      />
      <DeleteElements
        field={field}
        guestFields={guestFields}
        rdfFields={rdfFields}
        deletable={deletable}
        forceRender={render}
        webId={webId}
      />
    </Grid>
  );
}

export default ProfileField;
