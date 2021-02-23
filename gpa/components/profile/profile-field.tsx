import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/Home.module.css";
import EditFieldPopup from "./edit-field-popup";

function DeleteField(fieldName: string, fieldValue: string | null): void {}

function ProfileField({
  fieldName,
  fieldValue,
}: {
  fieldName: string;
  fieldValue: string | null;
}): JSX.Element {
  const [isPopupShowing, setPopupVisibility] = useState(false);
  return (
    <div className={styles.horizontalContainer}>
      <div>{fieldName}:</div>
      <div>{fieldValue}</div>
      <button onClick={() => setPopupVisibility(true)}>Edit</button>
      <button onClick={() => DeleteField(fieldName, fieldValue)}>Delete</button>
      <EditFieldPopup
        fieldName={fieldName}
        fieldValue={fieldValue}
        isPopupShowing={isPopupShowing}
        setPopupVisibility={setPopupVisibility}
      />
    </div>
  );
}

export default ProfileField;
