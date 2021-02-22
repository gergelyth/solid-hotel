import { useGuest } from "../../hooks/useGuest";
import styles from "../../styles/Home.module.css";
import { Guest } from "../../types/Guest";
import ProfileField from "./profile-field";

type Field = {
  fieldName: string;
  fieldValue: string;
};

function GetFieldsRecursively(object: any): Field[] {
  const fieldElements: Field[] = [];
  for (const field in object) {
    const fieldValue = object[field];
    if (typeof fieldValue === "object") {
      const recFields = GetFieldsRecursively(fieldValue);
      fieldElements.push(recFields);
    } else {
      fieldElements.push({
        fieldName: field,
        fieldValue: fieldValue.toString(),
      });
    }
  }
  console.log(fieldElements);

  return fieldElements.flat();
}

function CreateFieldElements(guest: Guest): JSX.Element {
  const fieldElements = GetFieldsRecursively(guest);
  return (
    <div>
      <ul>
        {fieldElements.map((item) => {
          return <li key={item.fieldName}>{ProfileField(item)}</li>;
        })}
      </ul>
    </div>
  );
}

function ProfileMain(): JSX.Element {
  const { guest, isLoading, isError } = useGuest();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !guest) {
    return (
      <div className={styles.simpleContainer}>
        <div>Error retrieving guest data.</div>
        <div>{isError}</div>
      </div>
    );
  }
  return (
    <div className={styles.simpleContainer}>
      <h2>
        {guest?.firstName} {guest?.lastName}
      </h2>
      {CreateFieldElements(guest)}
    </div>
  );
}

export default ProfileMain;
