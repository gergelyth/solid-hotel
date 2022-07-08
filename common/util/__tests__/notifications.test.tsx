import { createSolidDataset, getThing } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { LocalNodeSkolemPrefix } from "../../consts/solidIdentifiers";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationType } from "../../types/NotificationsType";
import { AddNotificationThingToDataset } from "../datasetFactory";
import {
  RetrieveAllNotifications,
  SetIsProcessedForNotification,
} from "../notifications";
import { SafeSaveDatasetAt } from "../solid_wrapper";
import { SerializeDataset, TestNotifications } from "./testUtil";

jest.mock("../../hooks/useNotifications", () => {
  return {
    useNotifications: jest.fn(),
  };
});

jest.mock("../solid_wrapper", () => {
  return {
    SafeSaveDatasetAt: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("notifications", () => {
  test("RetrieveAllNotifications triggers onReceived logic", async () => {
    const mockOnReceive = jest.fn();

    const testNotifications = [
      {
        ...TestNotifications[0],
        onReceive: mockOnReceive,
        isProcessed: false,
      },
      {
        ...TestNotifications[1],
        onReceive: mockOnReceive,
        isProcessed: true,
      },
    ];

    const notificationRetrieval = {
      items: testNotifications,
      isLoading: false,
      isError: false,
      isValidating: false,
    };

    (useNotifications as jest.Mock).mockReturnValue(notificationRetrieval);
    RetrieveAllNotifications("TestCoreUrl", [], {});

    expect(mockOnReceive).toBeCalledTimes(1);
  });

  test("SetIsProcessedForNotifications saves correct dataset", async () => {
    const mockDate = new Date("2021-08-22 15:33:21");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/notification> <something:notificationType> 0;
    <something:createdAt> "${mockDate.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <something:processed> true.
`;

    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    let dataset = createSolidDataset();
    dataset = AddNotificationThingToDataset(
      dataset,
      NotificationType.BookingRequest
    );
    const thing = getThing(dataset, LocalNodeSkolemPrefix + "notification");
    expect(thing).not.toBeNull();
    if (!thing) {
      return;
    }

    SetIsProcessedForNotification("TestUrl", dataset, thing);

    expect(calledUrl).toEqual("TestUrl");

    const serializedResult = await SerializeDataset(savedDataset);
    expect(serializedResult).toEqual(expectedRdf);

    jestDateSpy.mockRestore();
  });
});
