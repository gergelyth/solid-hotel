import { act, renderHook } from "@testing-library/react-hooks";
import { GetDataSet } from "../../util/solid";
import { MockContainer, TestReservations } from "../../util/__tests__/testUtil";
import { mockSolidDatasetFrom, SolidDataset } from "@inrupt/solid-client";
import { RevalidateReservations, useReservations } from "../useReservations";
import { CreateReservationDataset } from "../../util/datasetFactory";

const reservationTestUrl = "https://testpodurl.com/reservations/";

jest.mock("../../util/solid", () => {
  return {
    ...jest.requireActual("../../util/solid"),
    GetDataSet: jest.fn(),
  };
});

const reservationDatasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/reservations/": MockContainer(
    "https://testpodurl.com/reservations/",
    ["reservationId1/", "reservationId2/"]
  ),
  "https://testpodurl.com/reservations/reservationId1/": MockContainer(
    "https://testpodurl.com/reservations/reservationId1/",
    ["inbox", "reservation"]
  ),
  "https://testpodurl.com/reservations/reservationId2/": MockContainer(
    "https://testpodurl.com/reservations/reservationId2/",
    ["inbox", "reservation"]
  ),
  "https://testpodurl.com/reservations/reservationId1/inbox/": MockContainer(
    "https://testpodurl.com/reservations/reservationId1/inbox/",
    []
  ),
  "https://testpodurl.com/reservations/reservationId2/inbox/": MockContainer(
    "https://testpodurl.com/reservations/reservationId2/inbox/",
    []
  ),
  "https://testpodurl.com/reservations/reservationId1/reservation":
    CreateReservationDataset(TestReservations[0]),
  "https://testpodurl.com/reservations/reservationId2/reservation":
    CreateReservationDataset(TestReservations[1]),
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
  (GetDataSet as jest.Mock).mockImplementation((url) =>
    MockGetDataSet(reservationDatasetMap, url)
  );
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("useReservations", () => {
  test("Returns correct data", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useReservations(reservationTestUrl)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);

    expect(returnValue.items).toEqual(TestReservations);
  });

  test("RevalidateReservations calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    RevalidateReservations();

    expect(mockMutate).toBeCalledWith("reservations");
  });
});
