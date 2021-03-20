import { Dispatch, SetStateAction } from "react";
import styles from "../../../common/styles/Home.module.css";
import { RemoveField } from "../../../common/util/solid";
import { personFieldToRdfMap } from "../../../common/vocabularies/rdf_person";

function DeleteFieldPopup({
  fieldName,
  setFieldValueInParent,
  isPopupShowing,
  setPopupVisibility,
}: {
  fieldName: string;
  setFieldValueInParent: (newValue: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  if (!isPopupShowing) {
    return null;
  }

  // TODO: display fieldValue in inputfield
  return (
    <div className={`${styles.simpleContainer} ${styles.popup}`}>
      <div className={`${styles.simpleContainer} ${styles.popup_inner}`}>
        <div>Delete the following field?</div>
        <strong>{fieldName}</strong>
        <div className={`${styles.horizontalContainer}`}>
          <button onClick={() => setPopupVisibility(false)}>Cancel</button>
          <button
            onClick={() => {
              RemoveField(personFieldToRdfMap[fieldName]);
              setFieldValueInParent("<Field was deleted>");
              setPopupVisibility(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFieldPopup;
