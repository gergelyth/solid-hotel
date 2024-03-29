import { createSolidDataset } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { CountryToRdfMap } from "../../vocabularies/rdfCountries";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import {
  CreateDataProtectionProfile,
  CreateHotelProfile,
  GetHotelProfileThing,
} from "../hotelProfileHandler";
import { GetDataSet } from "../solid";
import { SafeSaveDatasetInContainer } from "../solidWrapper";
import {
  DeserializeDataset,
  SerializeDataset,
  TestGuestFields,
} from "./testUtil";

jest.mock("../solidWrapper", () => {
  return {
    SafeSaveDatasetInContainer: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    ...jest.requireActual("../solid"),
    GetDataSet: jest.fn(),
  };
});
jest.mock("../../consts/solidIdentifiers", () => {
  return {
    ...jest.requireActual("../../consts/solidIdentifiers"),
    DataProtectionProfilesUrl: "DataProtectionContainerUrl",
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("hotelProfileHandler", () => {
  test("CreateHotelProfile saves the correct dataset and returns the correct URL", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetInContainer as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
        return {
          internal_resourceInfo: {
            sourceIri: "https://testpodurl.com/profiles/11111111",
            isRawData: true,
          },
        };
      }
    );

    const resultUrl = await CreateHotelProfile(
      TestGuestFields,
      "TestContainerUrl"
    );

    expect(SafeSaveDatasetInContainer).toBeCalledTimes(1);
    expect(calledUrl).toEqual("TestContainerUrl");

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/hotelProfile> a <${PersonFieldToRdfMap.type}>;
    <${PersonFieldToRdfMap.firstName}> "John";
    <${PersonFieldToRdfMap.lastName}> "Smith";
    <${PersonFieldToRdfMap.nationality}> "${CountryToRdfMap.GBR}".
`;
    const serializedResult = await SerializeDataset(savedDataset);
    expect(serializedResult).toEqual(expectedRdf);

    expect(resultUrl).toEqual(
      "https://testpodurl.com/profiles/11111111#hotelProfile"
    );
  });

  test("CreateDataProtectionProfile saves the correct dataset and returns the correct URL", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetInContainer as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
        return {
          internal_resourceInfo: {
            sourceIri: "https://testpodurl.com/profiles/11111111",
            isRawData: true,
          },
        };
      }
    );

    const resultUrl = await CreateDataProtectionProfile(TestGuestFields);

    expect(SafeSaveDatasetInContainer).toBeCalledTimes(1);
    expect(calledUrl).toEqual("DataProtectionContainerUrl");

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/hotelProfile> a <${PersonFieldToRdfMap.type}>;
    <${PersonFieldToRdfMap.firstName}> "John";
    <${PersonFieldToRdfMap.lastName}> "Smith";
    <${PersonFieldToRdfMap.nationality}> "${CountryToRdfMap.GBR}".
`;
    const serializedResult = await SerializeDataset(savedDataset);
    expect(serializedResult).toEqual(expectedRdf);

    expect(resultUrl).toEqual(
      "https://testpodurl.com/profiles/11111111#hotelProfile"
    );
  });

  test("GetHotelProfileThing returns correct data", async () => {
    const rdf = `<https://inrupt.com/.well-known/sdk-local-node/hotelProfile> a <${PersonFieldToRdfMap.type}>;
    <${PersonFieldToRdfMap.firstName}> "John";
    <${PersonFieldToRdfMap.lastName}> "Smith";
    <${PersonFieldToRdfMap.nationality}> "${CountryToRdfMap.GBR}".
`;
    const dataset = {
      ...(await DeserializeDataset(rdf)),
      internal_resourceInfo: {
        sourceIri: "https://testpodurl.com/profiles/11111111",
        isRawData: true,
      },
    };

    (GetDataSet as jest.Mock).mockImplementation(async () =>
      Promise.resolve(dataset)
    );

    const profileThing = await GetHotelProfileThing("TestUrl");
    expect(profileThing).not.toBeNull();

    expect(GetDataSet).toBeCalledWith("TestUrl");
    expect(GetDataSet).toBeCalledTimes(1);
  });
});
