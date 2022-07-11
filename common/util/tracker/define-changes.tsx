import { Dispatch, SetStateAction } from "react";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { Field } from "../../types/Field";
import { FieldValueChange, FindChangedFields } from "./util";
import { GetProfileOf } from "../solid_profile";

/**
 * A function which determines what changes were performed in the guest's personal information fields.
 * Used in two circumstances:
 * 1. The user performs a change in at least one field in the Solid Pod which we identify with a WebSocket update. In this case oldFields represent the values in cache, while newValues get
 * populated from the current state of the Solid Pod.
 * 2. We receive a notification that the counterparty performed a change in one of the fields. This case newChangeValues is populated and we set oldFields to equal the current guestFields
 * retrieved from the Pod.
 * After these variables are determined, we compare the set of fields and determine which field (RDF name) changed and from what value to what.
 * These changes are then propagated upwards with a setState action.
 */
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
