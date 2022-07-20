import {
  createSolidDataset,
  createThing,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { CreateHotelPrivacyTokenDataset } from "../../../common/util/datasetFactory";
import { GetDataSet } from "../../../common/util/solid";
import {
  SafeDeleteDataset,
  SafeSaveDatasetAt,
  SafeSaveDatasetInContainer,
} from "../../../common/util/solidWrapper";
import {
  MockSession,
  SerializeDataset,
  TestHotelPrivacyTokens,
  TestReservations,
} from "../../../common/util/__tests__/testUtil";
import { PersonFieldToRdfMap } from "../../../common/vocabularies/rdfPerson";
import { ReservationFieldToRdfMap } from "../../../common/vocabularies/rdfReservation";
import { SendPrivacyTokenDeletionNotice } from "../outgoingCommunications";
import {
  AnonymizeFieldsAndDeleteToken,
  CreateInboxPrivacyToken,
} from "../privacyHelper";

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
jest.mock("../../../common/util/solidReservations", () => {
  return {
    GetParsedReservationFromUrl: jest.fn(),
  };
});
jest.mock("../../../common/util/solidWrapper");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("privacyHelper", () => {
  test("AnonymizeFieldsAndDeleteToken anonymizes fields correctly", async () => {
    let dataset = createSolidDataset();
    let thing = createThing({ name: "testThing" });
    thing = setStringNoLocale(thing, PersonFieldToRdfMap.firstName, "John");
    thing = setStringNoLocale(thing, PersonFieldToRdfMap.lastName, "Smith");
    thing = setStringNoLocale(thing, PersonFieldToRdfMap.email, "TestEmail");
    dataset = setThing(dataset, thing);

    (GetDataSet as jest.Mock).mockReturnValue(dataset);
    await AnonymizeFieldsAndDeleteToken(
      TestHotelPrivacyTokens[0],
      "SuppliedGuestInboxUrl"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/testThing> <${PersonFieldToRdfMap.email}> "TestEmail";
    <${PersonFieldToRdfMap.firstName}> "Anonymized";
    <${PersonFieldToRdfMap.lastName}> "Anonymized".
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

  test("CreateInboxPrivacyToken creates correct tokens", async () => {
    (SafeSaveDatasetInContainer as jest.Mock).mockReturnValue({
      ...createSolidDataset(),
      internal_resourceInfo: {
        sourceIri: "TestSourceIri",
        isRawData: false,
      },
    });
    const guestToken = await CreateInboxPrivacyToken(
      "TestReservationUrl",
      "TestGuestInbox",
      TestReservations[0]
    );

    const expectedGuestPrivacyToken = {
      urlAtHotel: "TestSourceIri",
      fieldList: [ReservationFieldToRdfMap.inbox],
      reason: "Reservation inbox used for communication with the hotel",
      forReservationState: 1,
      expiry: new Date("2021-07-08"),
      hotelInboxForDeletion: "https://testpodurl.com/privacyinbox/",
      hotel: "TestWebId",
      urlAtGuest: undefined,
      reservation: undefined,
    };

    expect(guestToken).toEqual(expectedGuestPrivacyToken);

    const expectedHotelPrivacyToken = {
      urlAtHotel: null,
      fieldList: [ReservationFieldToRdfMap.inbox],
      reason: "Reservation inbox used for communication with the hotel",
      forReservationState: 1,
      expiry: new Date("2021-07-08"),
      datasetUrlTarget: "TestReservationUrl",
      guestInbox: "TestGuestInbox",
      reservation: "TestReservationUrl",
    };

    expect(SafeSaveDatasetInContainer).toBeCalledWith(
      "https://testpodurl.com/privacy/",
      expect.anything()
    );

    const savedTokenTokenDataset = (SafeSaveDatasetInContainer as jest.Mock)
      .mock.calls[0][1];
    expect(savedTokenTokenDataset).toEqual(
      CreateHotelPrivacyTokenDataset(expectedHotelPrivacyToken)
    );
  });
});
