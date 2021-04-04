import { Button } from "@material-ui/core";
import { useGuest } from "../../hooks/useGuest";

function ConfirmRequiredFieldsButton({
  onClickFunction,
  rdfFields,
}: {
  onClickFunction: () => void;
  rdfFields: string[] | undefined;
}): JSX.Element {
  const fieldsFetch = useGuest(rdfFields);

  return (
    <Button
      disabled={fieldsFetch.guestFields?.some((field) => !field.fieldValue)}
      //   disabled={false}
      variant="contained"
      color="primary"
      onClick={onClickFunction}
    >
      Proceed
    </Button>
  );
}

export default ConfirmRequiredFieldsButton;
