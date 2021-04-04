import { useState } from "react";
import EditFieldPopup from "./edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";
import { RemoveField, SetField } from "../../util/solid";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { Grid, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "../../types/Field";

function OnEditConfirmation(fieldName: string, newValue: string): void {
  SetField(personFieldToRdfMap[fieldName], newValue);
  // setFieldValueInParent(newValue);
  //TODO refetch as in room refresh here
}

function OnDeleteConfirmation(fieldName: string): void {
  RemoveField(personFieldToRdfMap[fieldName]);
  //TODO refetch as in room refresh here
  // setFieldValueInParent("<Field was deleted>");
}

function ProfileField({ field }: { field: Field }): JSX.Element {
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
        onConfirmation={OnEditConfirmation}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteFieldPopup
        fieldName={field.fieldShortName}
        onConfirmation={OnDeleteConfirmation}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Grid>
  );
}

export default ProfileField;
