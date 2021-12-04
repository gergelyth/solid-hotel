import { Field } from "../../types/Field";

export type FieldValueChange = {
  name: string;
  rdfName: string;
  oldValue: string;
  newValue: string;
};

export function FindChangedFields(
  cachedFields: Field[],
  newFields: Field[]
): FieldValueChange[] {
  const changedFields: FieldValueChange[] = [];

  newFields.forEach((newField) => {
    const cachedField = cachedFields.find(
      (x) => x.rdfName === newField.rdfName
    );
    if (!cachedField) {
      return;
    }

    if (cachedField.fieldValue !== newField.fieldValue) {
      changedFields.push({
        name: cachedField.fieldPrettyName,
        rdfName: cachedField.rdfName,
        //TODO change default value
        oldValue: cachedField.fieldValue ?? "",
        newValue: newField.fieldValue ?? "",
      });
    }
  });

  return changedFields;
}
