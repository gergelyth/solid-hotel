import {
  createContainerAt,
  createContainerInContainer,
  createSolidDataset,
  deleteSolidDataset,
  getSolidDataset,
  getSolidDatasetWithAcl,
  saveAclFor,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import "@testing-library/jest-dom";
import { mocked } from "ts-jest/utils";
import { ShowError } from "../helpers";
import {
  SafeCreateContainerAt,
  SafeCreateContainerInContainer,
  SafeDeleteDataset,
  SafeGetDataset,
  SafeGetDatasetWithAcl,
  SafeSaveAclFor,
  SafeSaveDatasetAt,
  SafeSaveDatasetInContainer,
} from "../solid_wrapper";

jest.mock("@inrupt/solid-client", () => {
  return {
    ...jest.requireActual("@inrupt/solid-client"),
    createContainerAt: jest.fn(),
    createContainerInContainer: jest.fn(),
    deleteSolidDataset: jest.fn(),
    getSolidDataset: jest.fn(),
    getSolidDatasetWithAcl: jest.fn(),
    saveAclFor: jest.fn(),
    saveSolidDatasetAt: jest.fn(),
    saveSolidDatasetInContainer: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    GetSession: jest.fn(() => MockSession()),
  };
});
jest.mock("../helpers", () => {
  return {
    ShowError: jest.fn(),
  };
});

const mockSessionFetch = (): void => undefined;
function MockSession(): Session {
  const mockSession = mocked({
    fetch: mockSessionFetch,
  } as unknown as Session);
  return mockSession;
}

beforeEach(() => {
  jest.clearAllMocks();
});

const testUrl = "https://www.testsolidpod.com/resource.ttl";
const testDataset = createSolidDataset();

describe("solid_wrapper", () => {
  test("SafeGetDataSet calls the appropriate Solid function with the right arguments", async () => {
    await SafeGetDataset(testUrl);

    expect(getSolidDataset).toBeCalledTimes(1);
    expect(getSolidDataset).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeGetDatasetWithAcl calls the appropriate Solid function with the right arguments", async () => {
    await SafeGetDatasetWithAcl(testUrl);

    expect(getSolidDatasetWithAcl).toBeCalledTimes(1);
    expect(getSolidDatasetWithAcl).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeCreateContainerAt calls the appropriate Solid function with the right arguments", async () => {
    await SafeCreateContainerAt(testUrl);

    expect(createContainerAt).toBeCalledTimes(1);
    expect(createContainerAt).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeCreateContainerInContainer calls the appropriate Solid function with the right arguments", async () => {
    await SafeCreateContainerInContainer(testUrl);

    expect(createContainerInContainer).toBeCalledTimes(1);
    expect(createContainerInContainer).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeSaveAclFor calls the appropriate Solid function with the right arguments", async () => {
    const datasetWithAcl = {
      ...createSolidDataset(),
      internal_resourceInfo: {
        sourceIri: "https://testpodurl.com/container/.acl",
        isRawData: false,
        contentType: "text/turtle",
        linkedResources: {},
        aclUrl: "TestAclUrl",
      },
    };

    await SafeSaveAclFor(datasetWithAcl, testDataset);

    expect(saveAclFor).toBeCalledTimes(1);
    expect(saveAclFor).toBeCalledWith(datasetWithAcl, testDataset, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeDeleteDataset calls the appropriate Solid function with the right arguments", async () => {
    await SafeDeleteDataset(testUrl);

    expect(deleteSolidDataset).toBeCalledTimes(1);
    expect(deleteSolidDataset).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeSaveDatasetAt calls the appropriate Solid function with the right arguments", async () => {
    await SafeSaveDatasetAt(testUrl, testDataset);

    expect(saveSolidDatasetAt).toBeCalledTimes(1);
    expect(saveSolidDatasetAt).toBeCalledWith(testUrl, testDataset, {
      fetch: mockSessionFetch,
    });
  });

  test("SafeSaveDatasetInContainer calls the appropriate Solid function with the right arguments", async () => {
    await SafeSaveDatasetInContainer(testUrl, testDataset);

    expect(saveSolidDatasetInContainer).toBeCalledTimes(1);
    expect(saveSolidDatasetInContainer).toBeCalledWith(testUrl, testDataset, {
      fetch: mockSessionFetch,
    });
  });

  test("If a wrapped method throws an Error, the error is reported without crashing", async () => {
    (getSolidDataset as jest.Mock).mockImplementation(() => {
      throw new Error("TestMessage");
    });
    await SafeGetDataset(testUrl);

    expect(getSolidDataset).toBeCalledTimes(1);
    expect(getSolidDataset).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
    expect(ShowError).toBeCalledTimes(1);
    expect(ShowError).toBeCalledWith(" [TestMessage]", false);
  });

  test("If a wrapped method throws an unknown, the error is reported without crashing", async () => {
    (getSolidDataset as jest.Mock).mockImplementation(() => {
      throw "TestMessage";
    });
    await SafeGetDataset(testUrl);

    expect(getSolidDataset).toBeCalledTimes(1);
    expect(getSolidDataset).toBeCalledWith(testUrl, {
      fetch: mockSessionFetch,
    });
    expect(ShowError).toBeCalledTimes(1);
    expect(ShowError).toBeCalledWith(" [TestMessage]", false);
  });
});
