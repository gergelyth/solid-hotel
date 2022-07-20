import {
  createSolidDataset,
  createThing,
  setInteger,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import { ISessionInfo, Session } from "@inrupt/solid-client-authn-browser";
import "@testing-library/jest-dom";
import { mocked } from "ts-jest/utils";
import { GetDataSet, GetSession } from "../solid";
import {
  GetField,
  GetProfile,
  GetProfileOf,
  RemoveField,
  SaveProfileThingToPod,
  SetField,
  SetFieldInSolidProfile,
  SetMultipleFieldsInProfile,
} from "../solidProfile";
import { SafeSaveDatasetAt } from "../solidWrapper";
import { SerializeDataset } from "./testUtil";

jest.mock("../solidWrapper", () => {
  return {
    SafeSaveDatasetAt: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    GetSession: jest.fn(),
    GetDataSet: jest.fn(),
  };
});

function MockSession(webId: string): Session {
  const sessionInfo: ISessionInfo = {
    isLoggedIn: true,
    sessionId: "dummy",
    webId: webId,
  };
  const mockSession = mocked({
    info: sessionInfo,
  } as unknown as Session);
  return mockSession;
}

const profileAddress = "https://testpodurl.com/profile/card";
const webId = "https://testpodurl.com/profile/card#me";

beforeEach(() => {
  (GetSession as jest.Mock).mockReturnValue(
    MockSession("https://testpodurl.com/profile/card#me")
  );
  let dataset = createSolidDataset();
  let thing = createThing({ url: webId });
  thing = setStringNoLocale(thing, "schema:TestProperty", "TestValue");
  dataset = setThing(dataset, thing);
  (GetDataSet as jest.Mock).mockReturnValue(dataset);

  jest.clearAllMocks();
});

describe("solidProfile", () => {
  test("GetProfile calls GetProfileOf with session ID", async () => {
    const result = await GetProfile();

    expect(GetDataSet).toBeCalledWith(profileAddress);
    expect(result?.profileAddress).toEqual(profileAddress);
  });

  test("GetProfileOf returns correct result", async () => {
    const result = await GetProfileOf(webId);

    expect(GetDataSet).toBeCalledWith(profileAddress);

    expect(result?.profileAddress).toEqual(profileAddress);
    expect(result?.profile).not.toBeNull();
    expect(result?.dataSet).not.toBeNull();
  });

  test("GetField retrieves field value correctly", async () => {
    const result = await GetField("schema:TestProperty");
    expect(result).toEqual("TestValue");
  });

  test("SetField sets field value correctly", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    await SetField("schema:TestProperty", "NewValue");

    expect(calledUrl).toEqual(profileAddress);

    const expectedRdf = `<https://testpodurl.com/profile/card#me> <schema:TestProperty> "NewValue".
`;
    expect(await SerializeDataset(savedDataset)).toEqual(expectedRdf);
  });

  test("SetFieldInSolidProfile sets field value correctly", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    const profile = await GetProfile();
    await SetFieldInSolidProfile(profile, "schema:TestProperty", "NewValue");

    expect(calledUrl).toEqual(profileAddress);

    const expectedRdf = `<https://testpodurl.com/profile/card#me> <schema:TestProperty> "NewValue".
`;
    expect(await SerializeDataset(savedDataset)).toEqual(expectedRdf);
  });

  test("SetMultipleFieldsInProfile sets field values correctly", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    await SetMultipleFieldsInProfile(webId, {
      "schema:TestProperty": "NewValue",
      "schema:AnotherProperty": "OtherNewValue",
    });

    expect(calledUrl).toEqual(profileAddress);

    const expectedRdf = `<https://testpodurl.com/profile/card#me> <schema:TestProperty> "NewValue";
    <schema:AnotherProperty> "OtherNewValue".
`;
    expect(await SerializeDataset(savedDataset)).toEqual(expectedRdf);
  });

  test("RemoveField removes field from profile correctly", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    await RemoveField("schema:TestProperty");

    expect(calledUrl).toEqual(profileAddress);
    expect(await SerializeDataset(savedDataset)).toEqual("");
  });

  test("SaveProfileThingToPod populates user profile correctly", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    let profileThing = createThing();
    profileThing = setStringNoLocale(
      profileThing,
      "schema:IncStrProperty",
      "Value1"
    );
    profileThing = setInteger(profileThing, "schema:IncNumberProperty", 2);
    await SaveProfileThingToPod(profileThing);

    expect(calledUrl).toEqual(profileAddress);
    const expectedRdf = `<https://testpodurl.com/profile/card#me> <schema:TestProperty> "TestValue";
    <schema:IncStrProperty> "Value1";
    <schema:IncNumberProperty> 2.
`;
    expect(await SerializeDataset(savedDataset)).toEqual(expectedRdf);
  });
});
