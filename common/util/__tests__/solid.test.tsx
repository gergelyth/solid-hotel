import {
  createSolidDataset,
  createThing,
  setThing,
} from "@inrupt/solid-client";
import {
  getDefaultSession,
  ISessionInfo,
  Session,
} from "@inrupt/solid-client-authn-browser";
import "@testing-library/jest-dom";
import { mocked } from "ts-jest/utils";
import {
  CheckIfLoggedIn,
  GetDataSet,
  GetPodOfSession,
  GetSession,
  GetThing,
  GetUserPrivacyPodUrl,
  SolidLogin,
  SolidLogout,
} from "../solid";
import { SafeGetDataset } from "../solidWrapper";

jest.mock("@inrupt/solid-client-authn-browser", () => {
  return {
    getDefaultSession: jest.fn(),
  };
});
jest.mock("../solidWrapper", () => {
  return {
    SafeGetDataset: jest.fn(),
  };
});

function MockSession(isLoggedIn: boolean): Session {
  const sessionInfo: ISessionInfo = {
    isLoggedIn: isLoggedIn,
    sessionId: "dummy",
    webId: "https://www.testpodurl.com/profile/card#me",
  };
  const mockSession = mocked({
    info: sessionInfo,
    handleIncomingRedirect: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  } as unknown as Session);
  return mockSession;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("solid", () => {
  test("GetSession returns default session", async () => {
    const mockSession = MockSession(false);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);
    const session = GetSession();
    expect(session).toEqual(mockSession);
  });

  test("CheckIfLoggedIn returns correct flag", async () => {
    const mockFalsySession = MockSession(false);
    (getDefaultSession as jest.Mock).mockReturnValue(mockFalsySession);
    expect(await CheckIfLoggedIn()).toBeFalsy();
    expect(mockFalsySession.handleIncomingRedirect).toBeCalledTimes(1);

    const mockTruthySession = MockSession(true);
    (getDefaultSession as jest.Mock).mockReturnValue(mockTruthySession);
    expect(await CheckIfLoggedIn()).toBeTruthy();
    expect(mockTruthySession.handleIncomingRedirect).toBeCalledTimes(1);
  });

  test("SolidLogin calls Solid function with correct arguments", async () => {
    const mockSession = MockSession(false);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);

    await SolidLogin("TestOidcIssuer");
    expect(mockSession.login).toBeCalledWith({
      oidcIssuer: "TestOidcIssuer",
      redirectUrl: "http://localhost/",
    });
  });

  test("SolidLogout calls Solid function", async () => {
    const mockSession = MockSession(true);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);

    await SolidLogout();
    expect(mockSession.logout).toBeCalled();
  });

  test("GetPodOfSession returns correct URL", async () => {
    const mockSession = MockSession(true);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);

    const result = GetPodOfSession();
    expect(result).toEqual("https://www.testpodurl.com");
  });

  test("GetDataSet returns correct dataset", async () => {
    const mockSession = MockSession(true);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);
    const dataset = createSolidDataset();
    (SafeGetDataset as jest.Mock).mockReturnValue(dataset);

    const result = await GetDataSet("TestUrl");
    expect(SafeGetDataset).toBeCalledWith("TestUrl");

    expect(result).toEqual(dataset);
  });

  test("GetThing returns correct local thing", async () => {
    const thingLocal = createThing({ name: "thingName" });
    let dataset = createSolidDataset();
    dataset = setThing(dataset, thingLocal);

    const datasetWithUrl = {
      ...dataset,
      internal_resourceInfo: {
        sourceIri: "https://testpodurl.com/resource.ttl",
        isRawData: false,
      },
    };

    const result = GetThing(datasetWithUrl, "thingName");
    expect(result).not.toBeNull();
  });

  test("GetThing returns correct persisted thing", async () => {
    const thingPersisted = createThing({
      url: "https://testpodurl.com/resource.ttl#thingName",
    });
    let dataset = createSolidDataset();
    dataset = setThing(dataset, thingPersisted);

    const datasetWithUrl = {
      ...dataset,
      internal_resourceInfo: {
        sourceIri: "https://testpodurl.com/resource.ttl",
        isRawData: false,
      },
    };

    const result = GetThing(datasetWithUrl, "thingName");
    expect(result).not.toBeNull();
  });

  test("GetUserPrivacyPodUrl returns correct URL", async () => {
    const mockSession = MockSession(true);
    (getDefaultSession as jest.Mock).mockReturnValue(mockSession);

    const result = GetUserPrivacyPodUrl();
    expect(result).toEqual("https://www.testpodurl.com/privacy/");
  });
});
