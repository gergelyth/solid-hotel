import { Dispatch, SetStateAction, useEffect } from "react";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { Field } from "../../types/Field";
import { FieldValueChange, FindChangedFields } from "./util";
import { CircularProgress } from "@material-ui/core";
import { GetProfileOf } from "../solid_profile";

async function CalculateChanges(
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

  //TODO default value only for debug
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

  const changedFields = FindChangedFields(previousFields, newValues);
  setChangedFields(changedFields);
  setOldGuestFields(guestFields);
}

function DefineChangesElement({
  profileUrl,
  rdfFields,
  setChangedFields,
  setOldGuestFields,
  oldFields,
  newChangeValues,
}: {
  profileUrl: string;
  rdfFields: string[];
  setChangedFields: Dispatch<SetStateAction<FieldValueChange[] | undefined>>;
  setOldGuestFields: Dispatch<SetStateAction<Field[] | undefined>>;
  //ProfileCache[props.profileUrl]
  oldFields?: Field[];
  newChangeValues?: {
    [rdfName: string]: string;
  };
}): JSX.Element {
  useEffect(() => {
    CalculateChanges(
      profileUrl,
      rdfFields,
      setChangedFields,
      setOldGuestFields,
      oldFields,
      newChangeValues
    );
  });

  return <CircularProgress />;
}

export default DefineChangesElement;
