import { Typography } from "@material-ui/core";
import { Field } from "../../types/Field";

/**
 * Finds the first and last name fields among the guest fields and concatenates their values.
 * @returns The full name of the guest if available.
 */
export function GuestFullName({
  guestFields,
}: {
  guestFields: Field[];
}): JSX.Element {
  return (
    <Typography variant="h6">
      {
        guestFields.find((field) => field.fieldShortName === "firstName")
          ?.fieldValue
      }{" "}
      {
        guestFields.find((field) => field.fieldShortName === "lastName")
          ?.fieldValue
      }
    </Typography>
  );
}
