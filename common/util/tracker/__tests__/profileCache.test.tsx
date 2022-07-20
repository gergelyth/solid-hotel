import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
  setUrl,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { CountryToRdfMap } from "../../../vocabularies/rdfCountries";
import { PersonFieldToRdfMap } from "../../../vocabularies/rdfPerson";
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
  thing = setStringNoLocale(thing, PersonFieldToRdfMap["firstName"], "John");
  thing = setStringNoLocale(thing, PersonFieldToRdfMap["lastName"], "Smith");
  thing = setUrl(
    thing,
    PersonFieldToRdfMap["nationality"],
    CountryToRdfMap.GBR
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
    profileUpdate[PersonFieldToRdfMap["firstName"]] = {
      status: false,
      newValue: "Sam",
    };
    profileUpdate[PersonFieldToRdfMap["nationality"]] = {
      status: true,
      newValue: CountryToRdfMap.ESP,
    };

    UpdateProfileInMemory(webId, profileUpdate);
    expect(ProfileCache[webId][0].fieldValue).toEqual("John");
    expect(ProfileCache[webId][2].fieldValue).toEqual(CountryToRdfMap.ESP);
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
