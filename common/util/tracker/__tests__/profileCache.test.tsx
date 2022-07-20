import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
  setUrl,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { countryToRdfMap } from "../../../vocabularies/rdf_countries";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { SolidProfile } from "../../solidProfile";
import { TestGuestFields } from "../../__tests__/testUtil";
import {
  CacheProfile,
  CacheProfileFields,
  DeleteFromCache,
  ProfileCache,
  UpdateProfileInMemory,
} from "../profileCache";
import { ProfileUpdate } from "../../../components/profilesync/tracker-send-change";

function MockSolidProfile(): SolidProfile {
  const webId = "https://testpodurl.com/profile/card#me";
  let thing = createThing({ name: webId });
  thing = setStringNoLocale(thing, personFieldToRdfMap["firstName"], "John");
  thing = setStringNoLocale(thing, personFieldToRdfMap["lastName"], "Smith");
  thing = setUrl(
    thing,
    personFieldToRdfMap["nationality"],
    countryToRdfMap.GBR
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

const webId = "https://testpodurl.com/profile/card#me";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("profileCache", () => {
  test("CacheProfile produces correct profile cache", async () => {
    DeleteFromCache(webId);

    const rdfFields = TestGuestFields.map((field) => field.rdfName);
    await CacheProfile(webId, rdfFields);

    const expectedProfileCache: { [url: string]: Field[] } = {};
    expectedProfileCache[webId] = TestGuestFields;

    expect(ProfileCache).toEqual(expectedProfileCache);
  });

  test("UpdateProfileInMemory updates correct fields", async () => {
    DeleteFromCache(webId);

    await CacheProfileFields(webId, TestGuestFields);

    const expectedProfileCache: { [url: string]: Field[] } = {};
    expectedProfileCache[webId] = TestGuestFields;

    expect(ProfileCache).toEqual(expectedProfileCache);

    const profileUpdate: ProfileUpdate = {};
    profileUpdate[personFieldToRdfMap["firstName"]] = {
      status: false,
      newValue: "Sam",
    };
    profileUpdate[personFieldToRdfMap["nationality"]] = {
      status: true,
      newValue: countryToRdfMap.ESP,
    };

    UpdateProfileInMemory(webId, profileUpdate);
    expect(ProfileCache[webId][0].fieldValue).toEqual("John");
    expect(ProfileCache[webId][2].fieldValue).toEqual(countryToRdfMap.ESP);
  });

  test("CacheProfileFields produces correct profile cache", async () => {
    DeleteFromCache(webId);

    await CacheProfileFields(webId, TestGuestFields);

    const expectedProfileCache: { [url: string]: Field[] } = {};
    expectedProfileCache[webId] = TestGuestFields;

    expect(ProfileCache).toEqual(expectedProfileCache);
  });

  test("DeleteFromCache removes WebId entry", async () => {
    await CacheProfileFields(webId, TestGuestFields);

    const expectedProfileCache: { [url: string]: Field[] } = {};
    expectedProfileCache[webId] = TestGuestFields;

    expect(ProfileCache).toEqual(expectedProfileCache);

    DeleteFromCache(webId);
    expect(ProfileCache).toEqual({});
  });
});
