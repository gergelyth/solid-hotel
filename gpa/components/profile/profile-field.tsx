import { useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import EditFieldPopup from "./edit-field-popup";
import DeleteFieldPopup from "./delete-field-popup";

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
        setFieldValueInParent={setFieldValue}
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
