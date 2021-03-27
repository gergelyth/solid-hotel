import { useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import EditFieldPopup from "../../../common/components/profile/edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";
import { SetField } from "../../../common/util/solid";
import { personFieldToRdfMap } from "../../../common/vocabularies/rdf_person";

function OnEditConfirmation(fieldName: string, newValue: string): void {
  SetField(personFieldToRdfMap[fieldName], newValue);
  // setFieldValueInParent(newValue);
  //TODO refetch as in room refresh here
}

function ProfileField({
  fieldName,
  fieldValue,
  setFieldValue,
}: {
  fieldName: string;
  fieldValue: string | null;
  setFieldValue: (newValue: string) => void;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);
  return (
    <div className={styles.horizontalContainer}>
      <div>{fieldName}:</div>
      <div>{fieldValue}</div>
      <button onClick={() => setEditPopupVisibility(true)}>Edit</button>
      <button onClick={() => setDeletePopupVisibility(true)}>Delete</button>
      <EditFieldPopup
        fieldName={fieldName}
        fieldValue={fieldValue}
        onConfirmation={OnEditConfirmation}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteFieldPopup
        fieldName={fieldName}
        setFieldValueInParent={setFieldValue}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </div>
  );
}

export default ProfileField;
