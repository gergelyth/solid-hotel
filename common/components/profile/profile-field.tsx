import { useState } from "react";
import { EditFieldPopup } from "./edit-field-popup";
import { DeleteFieldPopup } from "./delete-field-popup";
import { RemoveField, SetField } from "../../util/solidProfile";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import { Grid, Button, Box, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "../../types/Field";
import { TriggerRefetchGuest } from "../../hooks/useGuest";

/**
 * Executes the edit operation.
 * To give an immediate feedback, the change is applied immediately in the data cache and the Solid Pod is updated asynchronously.
 */
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
  SetField(PersonFieldToRdfMap[fieldName], newValue, webId);
  // RevalidateGuest(rdfFields, webId);
}

/**
 * Executes the delete operation.
 * To give an immediate feedback, the change is applied immediately in the data cache and the Solid Pod is updated asynchronously.
 */
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
  RemoveField(PersonFieldToRdfMap[fieldName], webId);
  // RevalidateGuest(rdfFields, webId);
}

/**
 * Handles the edit of the field if applicable.
 * The type of the input component is determined by the type of the field (string,enum,etc.).
 * @returns A component contaning the edit confirmation popup dialog and the button showing it.
 */
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
    <Box sx={{ mx: 1 }}>
      <Grid item xs={2}>
        <Button
          data-testid="edit-field-button"
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

/**
 * Handles the deletion of the field if applicable.
 * @returns A component contaning the delete confirmation popup dialog and the button showing it.
 */
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
    <Box sx={{ mx: 1 }}>
      <Grid item xs={2}>
        <Button
          data-testid="delete-field-button"
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

/**
 * Handles the display, edit and deletion of one profile field.
 * The field can be editable and deletable and either combination will work.
 * If the edit or delete action is carried out, the field is updated in the cache to show the result immediately and is updated in the Solid Pod asynchronously.
 * @returns A component containing the basic information about the field (name, current value) and an edit and delete button (depending on the editable and deletable properties).
 */
export function ProfileField({
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
    <Grid
      container
      item
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
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
