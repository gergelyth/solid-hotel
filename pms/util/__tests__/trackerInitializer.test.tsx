import { act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CacheHotelProfiles } from "../trackerInitializer";
import { MockContainer } from "../../../common/util/__tests__/testUtil";
import { CacheProfile } from "../../../common/util/tracker/profileCache";
import { Subscribe } from "../../../common/util/tracker/tracker";
import {
  createSolidDataset,
  createThing,
  mockSolidDatasetFrom,
  setStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { PersonFieldToRdfMap } from "../../../common/vocabularies/rdfPerson";
import { GetDataSet } from "../../../common/util/solid";

jest.mock("../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../common/util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});

jest.mock("../../../common/consts/solidIdentifiers", () => {
  return {
    HotelProfilesUrl: "https://testpodurl.com/hotelprofiles/",
  };
});

jest.mock("../../../common/components/snackbar");
jest.mock("../../../common/util/tracker/tracker");
jest.mock("../../../common/util/tracker/profileCache");

const datasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/hotelprofiles/": MockContainer(
    "https://testpodurl.com/hotelprofiles/",
    ["testResource1.ttl", "testResource2.ttl"]
  ),
  "https://testpodurl.com/hotelprofiles/testResource1.ttl": MockHotelProfile1(
    "https://testpodurl.com/hotelprofiles/testResource1.ttl#hotelProfile"
  ),
  "https://testpodurl.com/hotelprofiles/testResource2.ttl": MockHotelProfile2(
    "https://testpodurl.com/hotelprofiles/testResource2.ttl#hotelProfile"
  ),
};

function MockGetDataSet(url: string): Promise<SolidDataset> {
  const dataset = datasetMap[url];
  if (dataset) {
    return Promise.resolve(dataset);
  } else {
    return Promise.resolve(mockSolidDatasetFrom(url));
  }
}

function MockHotelProfile1(thingUrl: string): SolidDataset {
  let dataset = createSolidDataset();
  let thing = createThing({ url: thingUrl });
  thing = setStringNoLocale(thing, PersonFieldToRdfMap.firstName, "John");
  thing = setStringNoLocale(thing, PersonFieldToRdfMap.lastName, "Smith");

  dataset = setThing(dataset, thing);
  return dataset;
}

function MockHotelProfile2(thingUrl: string): SolidDataset {
  let dataset = createSolidDataset();
  let thing = createThing({ url: thingUrl });
  thing = setStringNoLocale(thing, PersonFieldToRdfMap.email, "TestEmail");

  dataset = setThing(dataset, thing);
  return dataset;
}

beforeEach(() => {
  (GetDataSet as jest.Mock).mockImplementation((url) => MockGetDataSet(url));
  jest.clearAllMocks();
});

describe("trackerInitializer", () => {
  test("Initialization caches profiles and subscribes to changes correctly", async () => {
    await CacheHotelProfiles();

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    expect(CacheProfile).toBeCalledWith(
      "https://testpodurl.com/hotelprofiles/testResource1.ttl#hotelProfile",
      [PersonFieldToRdfMap.firstName, PersonFieldToRdfMap.lastName]
    );
    expect(CacheProfile).toBeCalledWith(
      "https://testpodurl.com/hotelprofiles/testResource2.ttl#hotelProfile",
      [PersonFieldToRdfMap.email]
    );
    expect(Subscribe).toBeCalledWith(
      "https://testpodurl.com/hotelprofiles/testResource1.ttl#hotelProfile",
      expect.anything()
    );
    expect(Subscribe).toBeCalledWith(
      "https://testpodurl.com/hotelprofiles/testResource2.ttl#hotelProfile",
      expect.anything()
    );
  });
});
