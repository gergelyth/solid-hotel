import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import { SetField } from "../../../common/util/solid";
import { personFieldToRdfMap } from "../../../common/vocabularies/rdf_person";

function EditFieldPopup({
  fieldName,
  fieldValue,
  setFieldValueInParent,
  isPopupShowing,
  setPopupVisibility,
}: {
  fieldName: string;
  fieldValue: string | null;
  setFieldValueInParent: (newValue: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [currentFieldValue, setFieldValue] = useState(fieldValue ?? "");
  if (!isPopupShowing) {
    return null;
  }

  // TODO: display fieldValue in inputfield
  return (
    <div className={`${styles.simpleContainer} ${styles.popup}`}>
      <div className={`${styles.simpleContainer} ${styles.popup_inner}`}>
        <div>
          Edit field: <strong>{fieldName}</strong>
        </div>
        <textarea
          value={currentFieldValue}
          onChange={(event) => {
            setFieldValue(event.target.value);
          }}
        />
        <div className={`${styles.horizontalContainer}`}>
          <button onClick={() => setPopupVisibility(false)}>Cancel</button>
          <button
            onClick={() => {
              SetField(personFieldToRdfMap[fieldName], currentFieldValue);
              setFieldValueInParent(currentFieldValue);
              setPopupVisibility(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFieldPopup;
