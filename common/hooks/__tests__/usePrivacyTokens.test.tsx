import { act, renderHook } from "@testing-library/react-hooks";
import { GetDataSet } from "../../util/solid";
import { MockContainer } from "../../util/__tests__/testUtil";
import { mockSolidDatasetFrom, SolidDataset } from "@inrupt/solid-client";
import {
  RevalidateGuestPrivacyTokens,
  RevalidateHotelPrivacyTokens,
  useGuestPrivacyTokens,
  useHotelPrivacyTokens,
} from "../usePrivacyTokens";
import {
  CreateGuestPrivacyTokenDataset,
  CreateHotelPrivacyTokenDataset,
} from "../../util/datasetFactory";
import { HotelPrivacyToken } from "../../types/HotelPrivacyToken";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { ReservationState } from "../../types/ReservationState";
import { GuestPrivacyToken } from "../../types/GuestPrivacyToken";

const hotelTestPodUrl = "https://testpodurl.com/hotelprivacy/";
const guestTestPodUrl = "https://testpodurl.com/guestprivacy/";

jest.mock("../../util/solid", () => {
  return {
    ...jest.requireActual("../../util/solid"),
    GetDataSet: jest.fn(),
  };
});

const hotelPrivacyTokens: HotelPrivacyToken[] = [
  {
    urlAtHotel: "https://testpodurl.com/hotelprivacy/testResource1.ttl",
    fieldList: [personFieldToRdfMap.firstName, personFieldToRdfMap.lastName],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: new Date("2021-07-11"),
    datasetUrlTarget: "TestDatasetUrlTarget1",
    guestInbox: "TestGuestInbox1",
    reservation: "TestReservationUrl1",
  },
  {
    urlAtHotel: "https://testpodurl.com/hotelprivacy/testResource2.ttl",
    fieldList: [personFieldToRdfMap.firstName],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: new Date("2021-03-19"),
    datasetUrlTarget: "TestDatasetUrlTarget2",
    guestInbox: "TestGuestInbox2",
    reservation: "TestReservationUrl2",
  },
];

const hotelDatasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/hotelprivacy/": MockContainer(
    "https://testpodurl.com/hotelprivacy/",
    ["testResource1.ttl", "testResource2.ttl"]
  ),
  "https://testpodurl.com/hotelprivacy/testResource1.ttl":
    CreateHotelPrivacyTokenDataset(hotelPrivacyTokens[0]),
  "https://testpodurl.com/hotelprivacy/testResource2.ttl":
    CreateHotelPrivacyTokenDataset(hotelPrivacyTokens[1]),
};

const guestPrivacyTokens: GuestPrivacyToken[] = [
  {
    urlAtHotel: "TestUrlAtHotel1",
    fieldList: [personFieldToRdfMap.firstName, personFieldToRdfMap.lastName],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: new Date("2021-07-11"),
    hotelInboxForDeletion: "TestHotelInbox1",
    hotel: "TestHotelWebId1",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource3.ttl",
    reservation: "TestReservationUrl1",
  },
];

const guestDatasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/guestprivacy/": MockContainer(
    "https://testpodurl.com/guestprivacy/",
    ["testResource3.ttl"]
  ),
  "https://testpodurl.com/guestprivacy/testResource3.ttl":
    CreateGuestPrivacyTokenDataset(guestPrivacyTokens[0]),
};

function MockGetDataSet(
  datasetMap: { [url: string]: SolidDataset },
  url: string
): Promise<SolidDataset> {
  const dataset = datasetMap[url];
  if (dataset) {
    return Promise.resolve(dataset);
  } else {
    return Promise.resolve(mockSolidDatasetFrom(url));
  }
}

beforeEach(() => {
  act(() => {
    jest.useFakeTimers();
  });
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("usePrivacyTokens", () => {
  test("useHotelPrivacyTokens", async () => {
    (GetDataSet as jest.Mock).mockImplementation((url) =>
      MockGetDataSet(hotelDatasetMap, url)
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useHotelPrivacyTokens(hotelTestPodUrl)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);

    expect(returnValue.items).toEqual(hotelPrivacyTokens);
  });

  test("RevalidateHotelPrivacyTokens calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    RevalidateHotelPrivacyTokens();

    expect(mockMutate).toBeCalledWith("hotelPrivacy");
  });

  test("useGuestPrivacyTokens", async () => {
    (GetDataSet as jest.Mock).mockImplementation((url) =>
      MockGetDataSet(guestDatasetMap, url)
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useGuestPrivacyTokens(guestTestPodUrl)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(2);

    expect(returnValue.items).toEqual(guestPrivacyTokens);
  });

  test("RevalidateGuestPrivacyTokens calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    RevalidateGuestPrivacyTokens();

    expect(mockMutate).toBeCalledWith("guestPrivacy");
  });
});
