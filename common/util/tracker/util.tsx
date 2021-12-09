import { Field } from "../../types/Field";

export type FieldValueChange = {
  name: string;
  rdfName: string;
  oldValue: string;
  newValue: string;
};

export function FindChangedFields(
  oldFields: Field[],
  newValues: {
    [rdfName: string]: string;
  }
): FieldValueChange[] {
  const changedFields = Object.keys(newValues).reduce(
    (changedFields: FieldValueChange[], newValueRdf) => {
      const oldField = oldFields.find((x) => x.rdfName === newValueRdf);
      if (!oldField) {
        return changedFields;
      }

      if (oldField.fieldValue !== newValues[newValueRdf]) {
        changedFields.push({
          name: oldField.fieldPrettyName,
          rdfName: oldField.rdfName,
          //TODO change default value
          oldValue: oldField.fieldValue ?? "",
          newValue: newValues[newValueRdf] ?? "",
        });
      }

      return changedFields;
    },
    []
  );

  return changedFields;
}
