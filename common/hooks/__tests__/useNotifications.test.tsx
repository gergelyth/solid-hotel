import { act, renderHook } from "@testing-library/react-hooks";
import { RevalidateNotifications, useNotifications } from "../useNotifications";
import { ParserList } from "../../types/ParserList";
import { NotificationType } from "../../types/NotificationsType";
import { NotificationParser } from "../../types//NotificationParser";
import { GetDataSet } from "../../util/solid";
import { MockContainer } from "../../util/__tests__/testUtil";
import {
  mockSolidDatasetFrom,
  SolidDataset,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { SerializeReservationStateChange } from "../../notifications/ReservationStateChange";
import { ReservationState } from "../../types/ReservationState";
import { SerializePrivacyInformationDeletion } from "../../notifications/PrivacyInformationDeletion";

const testPodUrl = "https://testpodurl.com";

function DefaultParser(notificationType: string): NotificationParser {
  return () => {
    return {
      text: notificationType,
      onClick: () => undefined,
      onReceive: () => undefined,
    };
  };
}

const parsers: ParserList = {
  [NotificationType.ReservationStateChange]: DefaultParser("reservation"),
  [NotificationType.PrivacyTokenDeletion]: DefaultParser("privacy"),
};

jest.mock("../../util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});
jest.mock("../../util/notifications");

const datasetMap: { [url: string]: SolidDataset & WithResourceInfo } = {
  "https://testpodurl.com/reservations/": MockContainer(
    "https://testpodurl.com/reservations/",
    ["11111111/", "22222222/"]
  ),
  "https://testpodurl.com/bookingrequests/": MockContainer(
    "https://testpodurl.com/bookingrequests/",
    []
  ),
  "https://testpodurl.com/testresources/": MockContainer(
    "https://testpodurl.com/testresources/",
    ["testResource1.ttl", "testResource2.ttl"]
  ),
  "https://testpodurl.com/testresources/testResource1.ttl": {
    ...SerializeReservationStateChange(
      "TestReplyInbox",
      ReservationState.ACTIVE
    ),
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/testresources/testResource1",
      isRawData: false,
      contentType: "text/turtle",
    },
  },
  "https://testpodurl.com/testresources/testResource2.ttl": {
    ...SerializePrivacyInformationDeletion("TestTokenUrl"),
    internal_resourceInfo: {
      sourceIri: "https://testpodurl.com/testresources/testResource2",
      isRawData: false,
      contentType: "text/turtle",
    },
  },
};

function MockGetDataSet(url: string): Promise<SolidDataset & WithResourceInfo> {
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
  (GetDataSet as jest.Mock).mockImplementation((url) => MockGetDataSet(url));
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("useNotifications", () => {
  test("Queries correct paths according to glob", async () => {
    const inboxList: string[] = ["/bookingrequests/", "/reservations/*inbox"];

    const { result, waitForNextUpdate } = renderHook(() =>
      useNotifications(testPodUrl, inboxList, parsers)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(4);
    expect(GetDataSet).toHaveBeenNthCalledWith(
      1,
      "https://testpodurl.com/reservations/"
    );
    expect(GetDataSet).toHaveBeenNthCalledWith(
      2,
      "https://testpodurl.com/bookingrequests/"
    );
    expect(GetDataSet).toHaveBeenNthCalledWith(
      3,
      "https://testpodurl.com/reservations/11111111/inbox"
    );
    expect(GetDataSet).toHaveBeenNthCalledWith(
      4,
      "https://testpodurl.com/reservations/22222222/inbox"
    );
  });

  test("Produces the correct notification objects", async () => {
    const inboxList: string[] = ["/testresources/"];

    const { result, waitForNextUpdate } = renderHook(() =>
      useNotifications(testPodUrl, inboxList, parsers)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);

    const reservationNotification = returnValue.items[0];
    expect(reservationNotification?.notificationUrl).toEqual(
      "https://testpodurl.com/testresources/testResource1.ttl"
    );
    expect(reservationNotification?.type).toEqual(
      NotificationType.ReservationStateChange
    );
    expect(reservationNotification?.text).toEqual("reservation");

    const privacyNotification = returnValue.items[1];
    expect(privacyNotification?.notificationUrl).toEqual(
      "https://testpodurl.com/testresources/testResource2.ttl"
    );
    expect(privacyNotification?.type).toEqual(
      NotificationType.PrivacyTokenDeletion
    );
    expect(privacyNotification?.text).toEqual("privacy");
  });

  test("RevalidateNotifications calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    RevalidateNotifications(testPodUrl, [
      "/bookingrequests/",
      "/reservations/*inbox",
    ]);

    expect(mockMutate).toBeCalledWith([
      "notifications",
      "https://testpodurl.com",
      ["/bookingrequests/", "/reservations/*inbox"],
    ]);
  });
});
