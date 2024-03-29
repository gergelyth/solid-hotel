import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { ProfileMain } from "../profile-main";
import { useGuest } from "../../../hooks/useGuest";
import { PersonFieldToRdfMap } from "../../../vocabularies/rdfPerson";
import { CountryToRdfMap } from "../../../vocabularies/rdfCountries";

const testGuestFields: Field[] = [
  {
    fieldShortName: "firstName",
    fieldPrettyName: "First name",
    fieldValue: "John",
    rdfName: PersonFieldToRdfMap.firstName,
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "lastName",
    fieldPrettyName: "Last name",
    fieldValue: "Smith",
    rdfName: PersonFieldToRdfMap.lastName,
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: CountryToRdfMap.GBR,
    rdfName: PersonFieldToRdfMap.nationality,
    datatype: xmlSchemaTypes.country,
  },
];

jest.mock("../../../hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});

jest.mock("../input-type-elements", () => {
  return {
    FieldInputElementBasedOnType: () => null,
  };
});

function Render(): RenderResult {
  const rdfFields = testGuestFields.map((field) => field.rdfName);
  return render(<ProfileMain rdfFields={rdfFields} />);
}

beforeEach(() => {
  //We define this here instead of the import mock to be able to use the outside reference of xmlSchemaTypes.string
  (useGuest as jest.Mock).mockImplementation(() => {
    return {
      guestFields: testGuestFields,
      isLoading: false,
      isError: false,
    };
  });
});

describe("<ProfileMain />", () => {
  test("Renders correctly with the full name of the guest and the appropriate number of fields", async () => {
    const profileMainComponent = Render();
    expect(profileMainComponent).toBeDefined();

    expect(
      profileMainComponent.baseElement.innerHTML.includes("John Smith")
    ).toBeTruthy();

    const editButtons =
      profileMainComponent.queryAllByTestId("edit-field-button");
    expect(editButtons.length).toEqual(3);
  });
});
