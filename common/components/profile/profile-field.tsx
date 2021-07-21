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
  rdfFields: string[] | undefined
): void {
  fields.forEach((field) => {
    if (field.fieldShortName === fieldName) {
      field.fieldValue = newValue;
    }
  });
  TriggerRefetchGuest(rdfFields, fields);
  SetField(personFieldToRdfMap[fieldName], newValue);
  RevalidateGuest(rdfFields);
}

function OnDeleteConfirmation(
  fieldName: string,
  fields: Field[],
  rdfFields: string[] | undefined
): void {
  fields.forEach((field, index) => {
    if (field?.fieldShortName === fieldName) fields.splice(index, 1);
  });
  TriggerRefetchGuest(rdfFields, fields);
  RemoveField(personFieldToRdfMap[fieldName]);
  RevalidateGuest(rdfFields);
}

function EditElements({
  field,
  guestFields,
  rdfFields,
  editable,
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  editable: boolean;
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
        onConfirmation={(fieldName, newValue) =>
          OnEditConfirmation(fieldName, newValue, guestFields, rdfFields)
        }
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
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  deletable: boolean;
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
        onConfirmation={(fieldName) =>
          OnDeleteConfirmation(fieldName, guestFields, rdfFields)
        }
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
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
  editable: boolean;
  deletable: boolean;
  centerJustify: boolean;
}): JSX.Element {
  return (
    <Grid container item justify="center" alignItems="center" direction="row">
      <Grid item xs={6}>
        <Typography
          variant="body1"
          align={centerJustify ? "center" : "inherit"}
        >
          {field.fieldPrettyName}:
        </Typography>
      </Grid>
      <Grid item xs={6}>
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
      />
      <DeleteElements
        field={field}
        guestFields={guestFields}
        rdfFields={rdfFields}
        deletable={deletable}
      />
    </Grid>
  );
}

export default ProfileField;
