import { useGuest } from "../../../common/hooks/useGuest";
import { CircularProgress, Button } from "@material-ui/core";
import { Field } from "../../../common/types/Field";
import { CSVLink } from "react-csv";
import { ShowError } from "../../../common/util/helpers";

/**
 * Prepares the CSV file data from the guest fields retrieved from the hotel Pod.
 * @returns The hotel profile of the guest in CSV format.
 */
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

/**
 * Prepares the personal information package in CSV format which can then be sent to the authorities.
 * @returns A button which triggers a prompt to download a CSV file with the personal information data of the guest (created from the hotel profile of the guest).
 */
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
    ShowError("Failed to retrieve guest information", true);
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
