import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestGuestFields } from "../../../../common/util/__tests__/testUtil";
import { ForeignPoliceReport } from "../foreign-police-report";
import { useGuest } from "../../../../common/hooks/useGuest";
import { PersonFieldToRdfMap } from "../../../../common/vocabularies/rdfPerson";
import { CountryToRdfMap } from "../../../../common/vocabularies/rdfCountries";

jest.mock("../../../../common/hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});

function Render(): RenderResult {
  const requiredFields = TestGuestFields.map((field) => field.rdfName);
  return render(
    <ForeignPoliceReport rdfFields={requiredFields} webId={"TestWebId"} />
  );
}

describe("<ForeignPoliceReport  />", () => {
  test("Renders correctly and creates the correct data", async () => {
    (useGuest as jest.Mock).mockImplementation(() => {
      return {
        guestFields: TestGuestFields,
        isLoading: false,
        isError: false,
      };
    });

    const policeReportComponent = Render();
    expect(policeReportComponent).toBeDefined();

    const linkElement = policeReportComponent.container.querySelector("a");
    expect(linkElement).not.toBeNull();

    const linkValue = linkElement?.href;
    expect(linkValue).toContain(
      `"Field name","RDF property","Value""First name","${PersonFieldToRdfMap.firstName}","John""Last name","${PersonFieldToRdfMap.lastName}","Smith""Nationality","${PersonFieldToRdfMap.nationality}","${CountryToRdfMap.GBR}"`
    );
  });
});
