import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { GuestFullName } from "../guest-full-name";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { countryToRdfMap } from "../../../vocabularies/rdf_countries";

function Render(testGuestFields: Field[]): RenderResult {
  return render(<GuestFullName guestFields={testGuestFields} />);
}

describe("<GuestFullName />", () => {
  test("Component renders correctly and returns the name of the guest if the fields are passed", async () => {
    const testGuestFields: Field[] = [
      {
        fieldShortName: "firstName",
        fieldPrettyName: "First name",
        fieldValue: "John",
        rdfName: personFieldToRdfMap.firstName,
        datatype: xmlSchemaTypes.string,
      },
      {
        fieldShortName: "lastName",
        fieldPrettyName: "Last name",
        fieldValue: "Smith",
        rdfName: personFieldToRdfMap.lastName,
        datatype: xmlSchemaTypes.string,
      },
      {
        fieldShortName: "nationality",
        fieldPrettyName: "Nationality",
        fieldValue: countryToRdfMap.GBR,
        rdfName: personFieldToRdfMap.nationality,
        datatype: xmlSchemaTypes.country,
      },
    ];

    const guestFullName = Render(testGuestFields);
    expect(guestFullName).toBeDefined();
    expect(
      guestFullName.baseElement.innerHTML.includes("John Smith")
    ).toBeTruthy();
  });

  test("Component renders correctly and returns the first name of the guest if the last name field is not present", async () => {
    const testGuestFields: Field[] = [
      {
        fieldShortName: "firstName",
        fieldPrettyName: "First name",
        fieldValue: "John",
        rdfName: personFieldToRdfMap.firstName,
        datatype: xmlSchemaTypes.string,
      },
    ];

    const guestFullName = Render(testGuestFields);
    expect(guestFullName).toBeDefined();
    expect(guestFullName.baseElement.innerHTML.includes("John")).toBeTruthy();
  });
});
