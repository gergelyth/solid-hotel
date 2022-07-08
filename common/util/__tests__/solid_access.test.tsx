import {
  AclDataset,
  createAclFromFallbackAcl,
  createSolidDataset,
  getNamedNode,
  getThingAll,
  SolidDataset,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import {
  SetReadAccessToEveryone,
  SetSubmitterAccessToEveryone,
} from "../solid_access";
import { SafeGetDatasetWithAcl, SafeSaveAclFor } from "../solid_wrapper";

jest.mock("../solid_wrapper", () => {
  return {
    SafeGetDatasetWithAcl: jest.fn(),
    SafeSaveAclFor: jest.fn(),
  };
});
jest.mock("@inrupt/solid-client", () => {
  return {
    ...jest.requireActual("@inrupt/solid-client"),
    hasAccessibleAcl: () => true,
    hasFallbackAcl: () => true,
    createAclFromFallbackAcl: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

async function RunTest(testFunction: () => void): Promise<SolidDataset> {
  const aclDataset: AclDataset = {
    ...createSolidDataset(),
    internal_accessTo: "https://testpodurl.com/container/",
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/container/.acl",
      isRawData: false,
    },
  };
  (createAclFromFallbackAcl as jest.Mock).mockReturnValue(aclDataset);
  const dataset = {
    ...createSolidDataset(),
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/container/.acl",
      isRawData: false,
      contentType: "text/turtle",
      linkedResources: {},
    },
    internal_acl: {
      resourceAcl: null,
      fallbackAcl: aclDataset,
    },
  };

  let updatedAcl = createSolidDataset();
  (SafeSaveAclFor as jest.Mock).mockImplementation(async (d, uA) => {
    updatedAcl = uA;
  });
  (SafeGetDatasetWithAcl as jest.Mock).mockReturnValue(
    Promise.resolve(dataset)
  );

  await testFunction();
  return updatedAcl;
}

describe("solid_access", () => {
  test("SetReadAccessToEveryone creates correct ACL definition", async () => {
    const updatedAcl = await RunTest(
      async () =>
        await SetReadAccessToEveryone("https://testpodurl.com/container/")
    );

    const things = getThingAll(updatedAcl);
    const modeNamedNode1 = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#mode"
    );
    expect(modeNamedNode1?.value).toEqual("http://www.w3.org/ns/auth/acl#Read");
    const modeNamedNode2 = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#mode"
    );
    expect(modeNamedNode2?.value).toEqual("http://www.w3.org/ns/auth/acl#Read");
  });

  test("SetSubmitterAccessToEveryone creates correct ACL definition", async () => {
    const updatedAcl = await RunTest(
      async () =>
        await SetSubmitterAccessToEveryone("https://testpodurl.com/container/")
    );

    const things = getThingAll(updatedAcl);
    const modeNamedNode = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#mode"
    );
    expect(modeNamedNode?.value).toEqual(
      "http://www.w3.org/ns/auth/acl#Append"
    );
  });
});
