import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { GetDataSet } from "../../../common/util/solid";
import {
  SafeDeleteDataset,
  SafeSaveDatasetAt,
} from "../../../common/util/solid_wrapper";
import {
  MockSession,
  SerializeDataset,
  TestHotelPrivacyTokens,
} from "../../../common/util/__tests__/testUtil";
import { personFieldToRdfMap } from "../../../common/vocabularies/rdf_person";
import { SendPrivacyTokenDeletionNotice } from "../outgoingCommunications";
import { AnonymizeFieldsAndDeleteToken } from "../privacyHelper";

jest.mock("../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../common/util/solid", () => {
  return {
    GetDataSet: jest.fn(),
    GetSession: jest.fn(() => MockSession(true, "TestWebId")),
  };
});

jest.mock("../../../common/consts/solidIdentifiers", () => {
  return {
    PrivacyTokensUrl: "https://testpodurl.com/privacy/",
    PrivacyTokensInboxUrl: "https://testpodurl.com/privacyinbox/",
  };
});

jest.mock("../../../common/hooks/usePrivacyTokens");
jest.mock("../outgoingCommunications");
jest.mock("../../components/reservations/reservation-element");
jest.mock("../../../common/util/solid_reservations", () => {
  return {
    GetParsedReservationFromUrl: jest.fn(),
  };
});
jest.mock("../../../common/util/solid_wrapper");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("privacyHelper", () => {
  test("AnonymizeFieldsAndDeleteToken", async () => {
    let dataset = createSolidDataset();
    let thing = createThing({ name: "testThing" });
    thing = setStringNoLocale(thing, personFieldToRdfMap.firstName, "John");
    thing = setStringNoLocale(thing, personFieldToRdfMap.lastName, "Smith");
    thing = setStringNoLocale(thing, personFieldToRdfMap.email, "TestEmail");
    dataset = setThing(dataset, thing);

    (GetDataSet as jest.Mock).mockReturnValue(dataset);
    await AnonymizeFieldsAndDeleteToken(
      TestHotelPrivacyTokens[0],
      "SuppliedGuestInboxUrl"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/testThing> <${personFieldToRdfMap.email}> "TestEmail";
    <${personFieldToRdfMap.firstName}> "Anonymized";
    <${personFieldToRdfMap.lastName}> "Anonymized".
`;

    expect(SafeSaveDatasetAt).toBeCalledWith(
      "TestDatasetUrlTarget1",
      expect.anything()
    );

    const serializedResult = await SerializeDataset(
      (SafeSaveDatasetAt as jest.Mock).mock.calls[0][1]
    );
    expect(serializedResult).toEqual(expectedRdf);

    expect(SafeDeleteDataset).toBeCalledWith(
      "https://testpodurl.com/hotelprivacy/testResource1.ttl"
    );
    expect(SendPrivacyTokenDeletionNotice).toBeCalledWith(
      TestHotelPrivacyTokens[0],
      "SuppliedGuestInboxUrl"
    );
  });
});
