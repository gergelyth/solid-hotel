import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { SolidProfile } from "../../solid_profile";
import { TestGuestFields } from "../../__tests__/testUtil";
import {
  CacheProfile,
  CacheProfileFields,
  DeleteFromCache,
  ProfileCache,
  UpdateProfileInMemory,
} from "../profile-cache";
import { ProfileUpdate } from "../trackerSendChange";

function MockSolidProfile(): SolidProfile {
  const webId = "https://testpodurl.com/profile/card#me";
  let thing = createThing({ name: webId });
  thing = setStringNoLocale(thing, personFieldToRdfMap["firstName"], "John");
  thing = setStringNoLocale(thing, personFieldToRdfMap["lastName"], "Smith");
  thing = setStringNoLocale(
    thing,
    personFieldToRdfMap["nationality"],
    "English"
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

const webId = "https://testpodurl.com/profile/card#me";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("profile-cache", () => {
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
      newValue: "Spanish",
    };

    UpdateProfileInMemory(webId, profileUpdate);
    expect(ProfileCache[webId][0].fieldValue).toEqual("John");
    expect(ProfileCache[webId][2].fieldValue).toEqual("Spanish");
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