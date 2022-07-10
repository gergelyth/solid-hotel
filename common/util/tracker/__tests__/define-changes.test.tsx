import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { SolidProfile } from "../../solid_profile";
import { TestGuestFields } from "../../__tests__/testUtil";
import { CalculateChanges } from "../define-changes";

function MockSolidProfile(): SolidProfile {
  const webId = "https://testpodurl.com/profile/card#me";
  let thing = createThing({ name: webId });
  thing = setStringNoLocale(thing, personFieldToRdfMap["firstName"], "Sam");
  thing = setStringNoLocale(thing, personFieldToRdfMap["lastName"], "Smith");
  thing = setStringNoLocale(
    thing,
    personFieldToRdfMap["nationality"],
    "Spanish"
  );

  let dataset = createSolidDataset();
  dataset = setThing(dataset, thing);

  return {
    profileAddress: webId,
    profile: thing,
    dataSet: dataset,
  };
}

jest.mock("../../solid_profile", () => {
  return {
    GetProfileOf: jest.fn(() => MockSolidProfile()),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("define-changes", () => {
  test("CalculateChanges produces correct result when field changes were made directly in the Solid Pod", async () => {
    const mockSetChangedFields = jest.fn();
    const mockSetOldFields = jest.fn();
    const rdfFields = TestGuestFields.map((field) => field.rdfName);
    await CalculateChanges(
      "https://testpodurl.com/profile/card#me",
      rdfFields,
      mockSetChangedFields,
      mockSetOldFields,
      TestGuestFields,
      undefined
    );

    const profileFields = TestGuestFields;
    profileFields[0].fieldValue = "Sam";
    profileFields[2].fieldValue = "Spanish";
    expect(mockSetOldFields).toBeCalledWith(profileFields);

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
    expect(mockSetChangedFields).toBeCalledWith(changedFields);
  });

  test("CalculateChanges produces correct result when field changes were received from counterparty", async () => {
    const mockSetChangedFields = jest.fn();
    const mockSetOldFields = jest.fn();
    const rdfFields = TestGuestFields.map((field) => field.rdfName);

    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[personFieldToRdfMap["firstName"]] = "John";
    newChangeValues[personFieldToRdfMap["nationality"]] = "English";

    await CalculateChanges(
      "https://testpodurl.com/profile/card#me",
      rdfFields,
      mockSetChangedFields,
      mockSetOldFields,
      undefined,
      newChangeValues
    );

    const profileFields = TestGuestFields;
    profileFields[0].fieldValue = "Sam";
    profileFields[2].fieldValue = "Spanish";
    expect(mockSetOldFields).toBeCalledWith(profileFields);

    const changedFields = [
      {
        name: "First name",
        rdfName: personFieldToRdfMap["firstName"],
        oldValue: "Sam",
        newValue: "John",
      },
      {
        name: "Nationality",
        rdfName: personFieldToRdfMap["nationality"],
        oldValue: "Spanish",
        newValue: "English",
      },
    ];
    expect(mockSetChangedFields).toBeCalledWith(changedFields);
  });

  test("CalculateChanges produces correct result when field changes were received from counterparty and only a subset was actually changed", async () => {
    const mockSetChangedFields = jest.fn();
    const mockSetOldFields = jest.fn();
    const rdfFields = TestGuestFields.map((field) => field.rdfName);

    const newChangeValues: {
      [rdfName: string]: string;
    } = {};
    newChangeValues[personFieldToRdfMap["firstName"]] = "Sam";
    newChangeValues[personFieldToRdfMap["nationality"]] = "English";

    await CalculateChanges(
      "https://testpodurl.com/profile/card#me",
      rdfFields,
      mockSetChangedFields,
      mockSetOldFields,
      undefined,
      newChangeValues
    );

    const profileFields = TestGuestFields;
    profileFields[0].fieldValue = "Sam";
    profileFields[2].fieldValue = "Spanish";
    expect(mockSetOldFields).toBeCalledWith(profileFields);

    const changedFields = [
      {
        name: "Nationality",
        rdfName: personFieldToRdfMap["nationality"],
        oldValue: "Spanish",
        newValue: "English",
      },
    ];
    expect(mockSetChangedFields).toBeCalledWith(changedFields);
  });
});
