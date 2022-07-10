import "@testing-library/jest-dom";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { TestGuestFields } from "../../__tests__/testUtil";
import { FindChangedFields } from "../util";

describe("tracker-util", () => {
  test("FindChangedFields returns correct data if all values are different", async () => {
    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[personFieldToRdfMap["firstName"]] = "Sam";
    newChangeValues[personFieldToRdfMap["nationality"]] = "Spanish";

    const result = FindChangedFields(TestGuestFields, newChangeValues);

    const changedFields = [
      {
        name: "First name",
        rdfName: personFieldToRdfMap["firstName"],
        oldValue: "John",
        newValue: "Sam",
      },
      {
        name: "Nationality",
        rdfName: personFieldToRdfMap["nationality"],
        oldValue: "English",
        newValue: "Spanish",
      },
    ];
    expect(result).toEqual(changedFields);
  });

  test("FindChangedFields returns correct data if only a subset of values are different", async () => {
    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[personFieldToRdfMap["firstName"]] = "Sam";
    newChangeValues[personFieldToRdfMap["nationality"]] = "English";

    const result = FindChangedFields(TestGuestFields, newChangeValues);

    const changedFields = [
      {
        name: "First name",
        rdfName: personFieldToRdfMap["firstName"],
        oldValue: "John",
        newValue: "Sam",
      },
    ];
    expect(result).toEqual(changedFields);
  });
});
