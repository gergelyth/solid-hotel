import { Typography } from "@material-ui/core";
import { Field } from "../../types/Field";

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
