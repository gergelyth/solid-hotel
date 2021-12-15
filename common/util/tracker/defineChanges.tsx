import { Dispatch, SetStateAction, useEffect } from "react";
import { RevalidateGuest, useGuest } from "../../hooks/useGuest";
import { Field } from "../../types/Field";
import { FieldValueChange, FindChangedFields } from "./util";
import { CloseSnackbar } from "../../components/snackbar";
import { CircularProgress } from "@material-ui/core";

function DefineChangesElement({
  key,
  profileUrl,
  rdfFields,
  setChangedFields,
  setOldGuestFields,
  oldFields,
  newChangeValues,
}: {
  key: string | number;
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
  RevalidateGuest(rdfFields, profileUrl);
  const { guestFields, isError } = useGuest(rdfFields, profileUrl);

  useEffect(() => {
    if (isError) {
      CloseSnackbar(key);
      throw new Error(`Failed to retrieve profile ${profileUrl}`);
    }
    if (!guestFields) {
      return;
    }

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

    const changedFields = FindChangedFields(previousFields, newValues);
    setChangedFields(changedFields);
    setOldGuestFields(guestFields);
  }, [guestFields, isError]);

  return <CircularProgress />;
}

export default DefineChangesElement;
