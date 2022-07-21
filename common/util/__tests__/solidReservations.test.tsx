import { createSolidDataset, Thing } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { ReservationState } from "../../types/ReservationState";
import { ReservationFieldToRdfMap } from "../../vocabularies/rdfReservation";
import { ReservationStateRdfMap } from "../../vocabularies/rdfReservationStatusTypes";
import { CreateReservationDataset } from "../datasetFactory";
import { GetDataSet } from "../solid";
import { SetSubmitterAccessToEveryone } from "../solidAccess";
import {
  AddReservation,
  GetOwnerFromReservation,
  GetParsedReservationFromUrl,
  GetUserReservationsPodUrl,
  SetReservationOwnerAndState,
  SetReservationOwnerToHotelProfile,
  SetReservationStateAndInbox,
} from "../solidReservations";
import {
  SafeCreateContainerAt,
  SafeCreateContainerInContainer,
  SafeSaveDatasetAt,
} from "../solidWrapper";
import { SerializeDataset, TestReservations } from "./testUtil";

jest.mock("../solidWrapper", () => {
  return {
    SafeSaveDatasetAt: jest.fn(),
    SafeDeleteDataset: jest.fn(),
    SafeCreateContainerAt: jest.fn(),
    SafeCreateContainerInContainer: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    ...jest.requireActual("../solid"),
    GetDataSet: jest.fn(),
    GetPodOfSession: jest.fn(() => "https://testpodurl.com"),
  };
});
jest.mock("../solidAccess", () => {
  return {
    SetSubmitterAccessToEveryone: jest.fn(),
    SetSubmitterAccessToAgent: jest.fn(),
  };
});

async function RunSetReservationFieldTest(
  test: () => void,
  expectedRdf: string
): Promise<void> {
  let calledUrl;
  let savedDataset = createSolidDataset();
  (SafeSaveDatasetAt as jest.Mock).mockImplementation(async (url, dataset) => {
    calledUrl = url;
    savedDataset = dataset;
  });

  const reservationDataset = CreateReservationDataset(TestReservations[0]);
  (GetDataSet as jest.Mock).mockReturnValue(reservationDataset);

  await test();

  expect(GetDataSet).toBeCalledWith(
    "https://testpodurl.com/reservations/reservationId1/reservation"
  );

  expect(SafeSaveDatasetAt).toBeCalledTimes(1);
  expect(calledUrl).toEqual(
    "https://testpodurl.com/reservations/reservationId1/reservation"
  );

  const serializedResult = await SerializeDataset(savedDataset);
  expect(serializedResult).toEqual(expectedRdf);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("solidReservations", () => {
  test("GetUserReservationsPodUrl returns correct URL", async () => {
    const result = GetUserReservationsPodUrl();
    expect(result).toEqual("https://testpodurl.com/reservations/");
  });

  test("AddReservation creates the correct reservation", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    const containerDataset = {
      ...createSolidDataset(),
      internal_resourceInfo: {
        sourceIri: "https://testpodurl.com/reservations/11111111/",
        isRawData: false,
        contentType: "text/turtle",
      },
    };
    (SafeCreateContainerInContainer as jest.Mock).mockReturnValue(
      containerDataset
    );

    const result = await AddReservation(TestReservations[0]);

    expect(SafeCreateContainerAt).toBeCalledWith(
      "https://testpodurl.com/reservations/"
    );

    expect(SafeCreateContainerInContainer).toBeCalledWith(
      "https://testpodurl.com/reservations/"
    );

    expect(SafeSaveDatasetAt).toBeCalledTimes(1);
    expect(calledUrl).toEqual(
      "https://testpodurl.com/reservations/11111111/reservation"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> a <${
      ReservationFieldToRdfMap.type
    }>;
    <${ReservationFieldToRdfMap.room}> <https://testpodurl.com/rooms/roomid1>;
    <${ReservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${
      ReservationFieldToRdfMap.hotel
    }> <https://testpodurl.com/profile/card#me>;
    <${ReservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${ReservationFieldToRdfMap.state}> <${
      ReservationStateRdfMap[ReservationState.CONFIRMED]
    }>;
    <${
      ReservationFieldToRdfMap.checkinTime
    }> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${
      ReservationFieldToRdfMap.checkoutTime
    }> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
`;

    const serializedResult = await SerializeDataset(savedDataset);
    expect(serializedResult).toEqual(expectedRdf);

    expect(SafeCreateContainerAt).toBeCalledWith(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
    expect(SetSubmitterAccessToEveryone).toBeCalledWith(
      "https://testpodurl.com/reservations/11111111/inbox"
    );

    expect(result).toEqual(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
  });

  test("SetReservationStateAndInbox modifies the correct fields", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> a <${
      ReservationFieldToRdfMap.type
    }>;
    <${ReservationFieldToRdfMap.room}> <https://testpodurl.com/rooms/roomid1>;
    <${
      ReservationFieldToRdfMap.hotel
    }> <https://testpodurl.com/profile/card#me>;
    <${ReservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${
      ReservationFieldToRdfMap.checkinTime
    }> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${
      ReservationFieldToRdfMap.checkoutTime
    }> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${ReservationFieldToRdfMap.state}> <${
      ReservationStateRdfMap[ReservationState.PAST]
    }>;
    <${ReservationFieldToRdfMap.inbox}> "NewInboxUrl".
`;

    const test = async (): Promise<void> =>
      await SetReservationStateAndInbox(
        "reservationId1",
        ReservationState.PAST,
        "NewInboxUrl"
      );

    RunSetReservationFieldTest(test, expectedRdf);
  });

  test("SetReservationOwnerToHotelProfile modifies the correct fields", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> a <${
      ReservationFieldToRdfMap.type
    }>;
    <${ReservationFieldToRdfMap.room}> <https://testpodurl.com/rooms/roomid1>;
    <${ReservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${
      ReservationFieldToRdfMap.hotel
    }> <https://testpodurl.com/profile/card#me>;
    <${ReservationFieldToRdfMap.state}> <${
      ReservationStateRdfMap[ReservationState.CONFIRMED]
    }>;
    <${
      ReservationFieldToRdfMap.checkinTime
    }> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${
      ReservationFieldToRdfMap.checkoutTime
    }> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${ReservationFieldToRdfMap.owner}> "NewHotelProfileWebId".
`;
    const test = async (): Promise<Thing> =>
      await SetReservationOwnerToHotelProfile(
        "reservationId1",
        "NewHotelProfileWebId"
      );

    RunSetReservationFieldTest(test, expectedRdf);
  });

  test("SetReservationOwnerAndState modifies the correct fields", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> a <${
      ReservationFieldToRdfMap.type
    }>;
    <${ReservationFieldToRdfMap.room}> <https://testpodurl.com/rooms/roomid1>;
    <${ReservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${
      ReservationFieldToRdfMap.hotel
    }> <https://testpodurl.com/profile/card#me>;
    <${
      ReservationFieldToRdfMap.checkinTime
    }> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${
      ReservationFieldToRdfMap.checkoutTime
    }> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${ReservationFieldToRdfMap.owner}> "NewHotelProfileWebId";
    <${ReservationFieldToRdfMap.state}> <${
      ReservationStateRdfMap[ReservationState.PAST]
    }>.
`;
    const test = async (): Promise<void> =>
      await SetReservationOwnerAndState(
        "reservationId1",
        "NewHotelProfileWebId",
        ReservationState.PAST
      );

    RunSetReservationFieldTest(test, expectedRdf);
  });

  test("GetOwnerFromReservation returns the correct value", async () => {
    const reservationDataset = CreateReservationDataset(TestReservations[0]);
    (GetDataSet as jest.Mock).mockReturnValue(reservationDataset);

    const result = await GetOwnerFromReservation("reservationId1");

    expect(GetDataSet).toBeCalledWith(
      "https://testpodurl.com/reservations/reservationId1/reservation"
    );
    expect(result).toEqual("OwnerWebId1");
  });

  test("GetParsedReservationFromUrl returns the correct value", async () => {
    const reservationDataset = CreateReservationDataset(TestReservations[0]);
    (GetDataSet as jest.Mock).mockReturnValue(reservationDataset);

    const result = await GetParsedReservationFromUrl(
      "https://testpodurl.com/reservations/reservationId1/reservation"
    );

    expect(GetDataSet).toBeCalledWith(
      "https://testpodurl.com/reservations/reservationId1/reservation"
    );
    expect(result).toEqual(TestReservations[0]);
  });
});
