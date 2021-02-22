import styles from "../../styles/Home.module.css";

function EditField(fieldName: string, fieldValue: string | undefined): void {}
function DeleteField(fieldName: string, fieldValue: string | undefined): void {}

function ProfileField({
  fieldName,
  fieldValue,
}: {
  fieldName: string;
  fieldValue: string | undefined;
}): JSX.Element {
  return (
    <div className={styles.horizontalContainer}>
      <div>{fieldName}:</div>
      <div>{fieldValue}</div>
      <button onClick={() => EditField(fieldName, fieldValue)}>Edit</button>
      <button onClick={() => DeleteField(fieldName, fieldValue)}>Delete</button>
    </div>
  );
}

export default ProfileField;
