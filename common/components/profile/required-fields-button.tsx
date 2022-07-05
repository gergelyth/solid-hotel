import { Button } from "@material-ui/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RevalidateGuest, useGuest } from "../../hooks/useGuest";

/**
 * Handles the check whether every field (list given by supplied RDF field list) has a value.
 * @returns A button which is disabled if a guest field has no value.
 */
export function ConfirmRequiredFieldsButton({
  onClickFunction,
  rdfFields,
  webId,
  onMount,
}: {
  onClickFunction: () => void;
  rdfFields: string[] | undefined;
  webId: string;
  onMount: (state: [boolean, Dispatch<SetStateAction<boolean>>]) => void;
}): JSX.Element {
  const [value, setValue] = useState(false);

  useEffect(() => {
    onMount([value, setValue]);
  }, [onMount, value]);

  RevalidateGuest(rdfFields, webId);
  const fieldsFetch = useGuest(rdfFields, webId);

  return (
    <Button
      data-testid="required-fields-button"
      disabled={
        !fieldsFetch.guestFields ||
        fieldsFetch.guestFields.some((field) => !field.fieldValue)
      }
      variant="contained"
      color="primary"
      onClick={onClickFunction}
    >
      Proceed
    </Button>
  );
}
