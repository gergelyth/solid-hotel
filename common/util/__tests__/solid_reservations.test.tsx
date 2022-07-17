import { createSolidDataset, Thing } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { ReservationState } from "../../types/ReservationState";
import { reservationFieldToRdfMap } from "../../vocabularies/rdf_reservation";
import { CreateReservationDataset } from "../datasetFactory";
import { GetDataSet } from "../solid";
import { SetSubmitterAccessToEveryone } from "../solid_access";
import {
  AddReservation,
  GetOwnerFromReservation,
  GetParsedReservationFromUrl,
  GetUserReservationsPodUrl,
  SetReservationOwnerAndState,
  SetReservationOwnerToHotelProfile,
  SetReservationStateAndInbox,
} from "../solid_reservations";
import {
  SafeCreateContainerAt,
  SafeCreateContainerInContainer,
  SafeSaveDatasetAt,
} from "../solid_wrapper";
import { SerializeDataset, TestReservations } from "./testUtil";

jest.mock("../solid_wrapper", () => {
  return {
    SafeSaveDatasetAt: jest.fn(),
    SafeDeleteDataset: jest.fn(),
    SafeCreateContainerAt: jest.fn(),
    SafeCreateContainerInContainer: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    GetDataSet: jest.fn(),
    GetPodOfSession: jest.fn(() => "https://testpodurl.com"),
  };
});
jest.mock("../solid_access", () => {
  return {
    SetSubmitterAccessToEveryone: jest.fn(),
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

describe("solid_reservations", () => {
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

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.room}> "RoomUrl1";
    <${reservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${reservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${reservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${reservationFieldToRdfMap.state}> 1;
    <${reservationFieldToRdfMap.checkinTime}> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.checkoutTime}> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
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
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.room}> "RoomUrl1";
    <${reservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${reservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${reservationFieldToRdfMap.checkinTime}> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.checkoutTime}> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.state}> 3;
    <${reservationFieldToRdfMap.inbox}> "NewInboxUrl".
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
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.room}> "RoomUrl1";
    <${reservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${reservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${reservationFieldToRdfMap.state}> 1;
    <${reservationFieldToRdfMap.checkinTime}> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.checkoutTime}> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.owner}> "NewHotelProfileWebId".
`;
    const test = async (): Promise<Thing> =>
      await SetReservationOwnerToHotelProfile(
        "reservationId1",
        "NewHotelProfileWebId"
      );

    RunSetReservationFieldTest(test, expectedRdf);
  });

  test("SetReservationOwnerAndState modifies the correct fields", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.room}> "RoomUrl1";
    <${reservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${reservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${reservationFieldToRdfMap.checkinTime}> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.checkoutTime}> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.owner}> "NewHotelProfileWebId";
    <${reservationFieldToRdfMap.state}> 3.
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
