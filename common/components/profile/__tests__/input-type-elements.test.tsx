import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { FieldInputElementBasedOnType } from "../input-type-elements";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { countryToRdfMap } from "../../../vocabularies/rdf_countries";

function Render(field: Field): RenderResult {
  return render(
    <FieldInputElementBasedOnType
      field={field}
      currentFieldValue={field.fieldValue}
      setFieldValue={() => undefined}
    />
  );
}

describe("<FieldInputElementBasedOnType />", () => {
  test("Component renders correctly and returns text input field for string typed field", async () => {
    const stringTestField: Field = {
      fieldShortName: "nationality",
      fieldPrettyName: "Nationality",
      fieldValue: countryToRdfMap.GBR,
      rdfName: personFieldToRdfMap.nationality,
      datatype: xmlSchemaTypes.country,
    };

    const fieldInputElement = Render(stringTestField);
    expect(fieldInputElement).toBeDefined();
    const fieldTextArea = fieldInputElement.queryByTestId("field-string-input");
    expect(fieldTextArea).toBeDefined();
  });

  test("Component renders correctly and returns date picker for date typed field", async () => {
    const dateTestField: Field = {
      fieldShortName: "idDocumentExpiry",
      fieldPrettyName: "ID Document expiry",
      fieldValue: "11/Jul/2022",
      rdfName: personFieldToRdfMap.expiry,
      datatype: xmlSchemaTypes.dateTime,
    };

    const datePickerElement = Render(dateTestField);
    expect(datePickerElement).toBeDefined();
    const datePicker = datePickerElement.queryByTestId("field-date-picker");
    expect(datePicker).toBeDefined();
  });

  test("Component renders correctly and returns enum picker for enum typed field", async () => {
    const enumTestField: Field = {
      fieldShortName: "idDocumentType",
      fieldPrettyName: "ID Document Type",
      fieldValue: "PASSPORT",
      rdfName: personFieldToRdfMap.idDocumentType,
      datatype: xmlSchemaTypes.idDocumentType,
    };

    const enumPickerElement = Render(enumTestField);
    expect(enumPickerElement).toBeDefined();
    const enumPicker = enumPickerElement.queryByTestId("field-enum-picker");
    expect(enumPicker).toBeDefined();
  });
});
