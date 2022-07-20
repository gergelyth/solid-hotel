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
  SetSubmitterAccessToAgent,
  SetSubmitterAccessToEveryone,
} from "../solidAccess";
import { SafeGetDatasetWithAcl, SafeSaveAclFor } from "../solidWrapper";

jest.mock("../solidWrapper", () => {
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

describe("solidAccess", () => {
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

    const agentClassNamedNode = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#agentClass"
    );
    expect(agentClassNamedNode?.value).toEqual(
      "http://xmlns.com/foaf/0.1/Agent"
    );
  });

  test("SetSubmitterAccessToAgent creates correct ACL definition", async () => {
    const updatedAcl = await RunTest(
      async () =>
        await SetSubmitterAccessToAgent(
          "https://testpodurl.com/container/",
          "https://webid.com/profile/card#me"
        )
    );

    const things = getThingAll(updatedAcl);
    const modeNamedNode = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#mode"
    );
    expect(modeNamedNode?.value).toEqual(
      "http://www.w3.org/ns/auth/acl#Append"
    );

    const agentNamedNode = getNamedNode(
      things[0],
      "http://www.w3.org/ns/auth/acl#agent"
    );
    expect(agentNamedNode?.value).toEqual("https://webid.com/profile/card#me");
  });
});
