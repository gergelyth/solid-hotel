import { Field } from "../../types/Field";

/** A helper type which encompasses the data about a personal information field change. */
export type FieldValueChange = {
  name: string;
  rdfName: string;
  oldValue: string;
  newValue: string;
};

/**
 * Compares the old guest fields against the new values and filters out true changes (where the value is indeed different in the versions).
 * @returns A {@link FieldValueChange} array containing all changes where the oldValue and newValue are different.
 */
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
