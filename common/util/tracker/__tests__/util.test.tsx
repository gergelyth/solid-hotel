import "@testing-library/jest-dom";
import { CountryToRdfMap } from "../../../vocabularies/rdfCountries";
import { PersonFieldToRdfMap } from "../../../vocabularies/rdfPerson";
import { TestGuestFields } from "../../__tests__/testUtil";
import { FindChangedFields } from "../util";

describe("tracker-util", () => {
  test("FindChangedFields returns correct data if all values are different", async () => {
    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[PersonFieldToRdfMap["firstName"]] = "Sam";
    newChangeValues[PersonFieldToRdfMap["nationality"]] = CountryToRdfMap.ESP;

    const result = FindChangedFields(TestGuestFields, newChangeValues);

    const changedFields = [
      {
        name: "First name",
        rdfName: PersonFieldToRdfMap["firstName"],
        oldValue: "John",
        newValue: "Sam",
      },
      {
        name: "Nationality",
        rdfName: PersonFieldToRdfMap["nationality"],
        oldValue: CountryToRdfMap.GBR,
        newValue: CountryToRdfMap.ESP,
      },
    ];
    expect(result).toEqual(changedFields);
  });

  test("FindChangedFields returns correct data if only a subset of values are different", async () => {
    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[PersonFieldToRdfMap["firstName"]] = "Sam";
    newChangeValues[PersonFieldToRdfMap["nationality"]] = CountryToRdfMap.GBR;

    const result = FindChangedFields(TestGuestFields, newChangeValues);

    const changedFields = [
      {
        name: "First name",
        rdfName: PersonFieldToRdfMap["firstName"],
        oldValue: "John",
        newValue: "Sam",
      },
    ];
    expect(result).toEqual(changedFields);
  });
});
