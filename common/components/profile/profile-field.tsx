import { useState } from "react";
import EditFieldPopup from "./edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";
import { RemoveField, SetField } from "../../util/solid";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { Grid, Button } from "@material-ui/core";
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

function ProfileField({
  field,
  guestFields,
  rdfFields,
}: {
  field: Field;
  guestFields: Field[];
  rdfFields: string[] | undefined;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);

  return (
    <Grid container item spacing={2} justify="center" alignItems="center">
      <Grid item xs={4}>
        {field.fieldPrettyName}:
      </Grid>
      <Grid item xs={4}>
        {field.fieldValue}
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setEditPopupVisibility(true)}
        >
          Edit
        </Button>
      </Grid>
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
      <EditFieldPopup
        field={field}
        onConfirmation={(fieldName, newValue) =>
          OnEditConfirmation(fieldName, newValue, guestFields, rdfFields)
        }
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteFieldPopup
        fieldName={field.fieldShortName}
        onConfirmation={(fieldName) =>
          OnDeleteConfirmation(fieldName, guestFields, rdfFields)
        }
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Grid>
  );
}

export default ProfileField;
