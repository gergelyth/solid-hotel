import { ShowErrorSnackbar } from "../../../common/components/snackbar";
import { useGuest } from "../../../common/hooks/useGuest";
import { CircularProgress, Button } from "@material-ui/core";
import { Field } from "../../../common/types/Field";
import { CSVLink } from "react-csv";

function PrepareCsvArray(guestFields: Field[]): string[][] {
  const guestArray: string[][] = [];
  guestFields.forEach((field) => {
    const fieldArray = [
      field.fieldPrettyName,
      field.rdfName,
      field.fieldValue ?? "<undefined>",
    ];
    guestArray.push(fieldArray);
  });
  return guestArray;
}

export function ForeignPoliceReport({
  rdfFields,
  webId,
}: {
  rdfFields: string[] | undefined;
  webId: string;
}): JSX.Element | null {
  const { guestFields, isLoading, isError } = useGuest(rdfFields, webId);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !guestFields) {
    ShowErrorSnackbar("Failed to retrieve guest information");
    return null;
  }

  const data = PrepareCsvArray(guestFields);
  const headers = ["Field name", "RDF property", "Value"];

  return (
    <CSVLink data={data} headers={headers} filename={"authority_report.csv"}>
      <Button variant="contained" color="primary">
        Export foreign police report
      </Button>
    </CSVLink>
  );
}
