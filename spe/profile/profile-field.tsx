import { useState } from "react";
import EditFieldPopup from "../../common/components/profile/edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";
import { RemoveField, SetField } from "../../common/util/solid";
import { personFieldToRdfMap } from "../../common/vocabularies/rdf_person";
import { Grid, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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

function ProfileField({
  fieldName,
  fieldValue,
}: {
  fieldName: string;
  fieldValue: string | null;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);

  return (
    <Grid container item spacing={2} justify="center" alignItems="center">
      <Grid item xs={4}>
        {fieldName}:
      </Grid>
      <Grid item xs={4}>
        {fieldValue}
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
        fieldName={fieldName}
        fieldValue={fieldValue}
        onConfirmation={OnEditConfirmation}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteFieldPopup
        fieldName={fieldName}
        onConfirmation={OnDeleteConfirmation}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </Grid>
  );
}

export default ProfileField;
