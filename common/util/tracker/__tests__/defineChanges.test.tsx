import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
  setUrl,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { countryToRdfMap } from "../../../vocabularies/rdf_countries";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { SolidProfile } from "../../solidProfile";
import { TestGuestFields } from "../../__tests__/testUtil";
import { CalculateChanges } from "../defineChanges";

function MockSolidProfile(): SolidProfile {
  const webId = "https://testpodurl.com/profile/card#me";
  let thing = createThing({ name: webId });
  thing = setStringNoLocale(thing, personFieldToRdfMap["firstName"], "Sam");
  thing = setStringNoLocale(thing, personFieldToRdfMap["lastName"], "Smith");
  thing = setUrl(
    thing,
    personFieldToRdfMap["nationality"],
    countryToRdfMap.ESP
  );

  let dataset = createSolidDataset();
  dataset = setThing(dataset, thing);

  return {
    profileAddress: webId,
    profile: thing,
    dataSet: dataset,
  };
}

jest.mock("../../solidProfile", () => {
  return {
    GetProfileOf: jest.fn(() => MockSolidProfile()),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("defineChanges", () => {
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
    profileFields[2].fieldValue = countryToRdfMap.ESP;
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
        oldValue: countryToRdfMap.GBR,
        newValue: countryToRdfMap.ESP,
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
    newChangeValues[personFieldToRdfMap["nationality"]] = countryToRdfMap.GBR;

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
    profileFields[2].fieldValue = countryToRdfMap.ESP;
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
        oldValue: countryToRdfMap.ESP,
        newValue: countryToRdfMap.GBR,
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
    newChangeValues[personFieldToRdfMap["nationality"]] = countryToRdfMap.GBR;

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
    profileFields[2].fieldValue = countryToRdfMap.ESP;
    expect(mockSetOldFields).toBeCalledWith(profileFields);

    const changedFields = [
      {
        name: "Nationality",
        rdfName: personFieldToRdfMap["nationality"],
        oldValue: countryToRdfMap.ESP,
        newValue: countryToRdfMap.GBR,
      },
    ];
    expect(mockSetChangedFields).toBeCalledWith(changedFields);
  });
});
