import { Dispatch, SetStateAction } from "react";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { Field } from "../../types/Field";
import { FieldValueChange, FindChangedFields } from "./util";
import { GetProfileOf } from "../solid_profile";

export async function CalculateChanges(
  profileUrl: string,
  rdfFields: string[],
  setChangedFields: Dispatch<SetStateAction<FieldValueChange[] | undefined>>,
  setOldGuestFields: Dispatch<SetStateAction<Field[] | undefined>>,
  oldFields?: Field[],
  newChangeValues?: {
    [rdfName: string]: string;
  }
): Promise<void> {
  const profile = await GetProfileOf(profileUrl);
  const guestFields = GetGuestFieldValues(profile, rdfFields);

  if (!guestFields) {
    console.log(`Guest retrieval failed of ${profileUrl}`);
    return;
  }

  console.log(oldFields);
  console.log(newChangeValues);

  const previousFields = oldFields ?? guestFields;
  const newValues =
    newChangeValues ??
    guestFields.reduce(
      (
        newChanges: {
          [rdfName: string]: string;
        },
        guestField
      ) => {
        //TODO default value
        newChanges[guestField.rdfName] = guestField.fieldValue ?? "";
        return newChanges;
      },
      {}
    );

  console.log("define changes");
  console.log(previousFields);
  console.log(newValues);

  //important that this is before the setChangedFields() because of rendering order
  setOldGuestFields(guestFields);

  const changedFields = FindChangedFields(previousFields, newValues);
  setChangedFields(changedFields);
}
