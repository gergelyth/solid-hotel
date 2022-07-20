import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationType } from "../../types/NotificationsType";
import { Notification } from "../../types/Notification";
import { GetNotificationElements } from "../notification-elements";
import { SafeDeleteDataset } from "../../util/solidWrapper";
import { RetrieveAllNotifications } from "../../util/notifications";

const testNotifications: Notification[] = [
  {
    notificationUrl: "TestUrl1",
    isProcessed: true,
    type: NotificationType.BookingRequest,
    text: "TestMessage1",
    createdAt: new Date("2021-07-01 16:33:25"),
    onClick: () => undefined,
    onReceive: () => undefined,
  },
  {
    notificationUrl: "TestUrl2",
    isProcessed: true,
    type: NotificationType.PrivacyToken,
    text: "TestMessage2",
    createdAt: new Date("2021-07-03 12:34:11"),
    onClick: () => undefined,
    onReceive: () => undefined,
  },
];

const notificationRetrieval = {
  items: testNotifications,
  isLoading: false,
  isError: false,
};

jest.mock("../../hooks/useNotifications");

jest.mock("../../util/solidWrapper", () => {
  return {
    SafeDeleteDataset: jest.fn(),
  };
});

jest.mock("../../util/notifications", () => {
  return {
    RetrieveAllNotifications: jest.fn(),
  };
});

let deleteNotification: (notification: Notification) => Promise<void>;
jest.mock("../notification-list", () => {
  return {
    NotificationList: (props: {
      notificationRetrieval:
        | {
            items: (Notification | null)[];
            isLoading: boolean;
            isError: boolean;
          }
        | undefined;
      deleteNotification: (notification: Notification) => Promise<void>;
    }) => {
      deleteNotification = props.deleteNotification;
      return null;
    },
  };
});

describe("GetNotificationElements()", () => {
  test("Notification panel renders correctly and delete action triggers dataset delete", async () => {
    const mockSafeDeleteDataset = jest.fn();
    (SafeDeleteDataset as jest.Mock).mockImplementation((notification) =>
      mockSafeDeleteDataset(notification)
    );
    (RetrieveAllNotifications as jest.Mock).mockImplementation(() => {
      return notificationRetrieval;
    });

    const notificationElements = GetNotificationElements(
      "TestAddress",
      [],
      {},
      true,
      () => undefined
    );
    const notificationPanel = notificationElements.panel;
    expect(notificationPanel).toBeDefined();

    const notificationIconComponent = render(<>{notificationPanel}</>);
    expect(notificationIconComponent).toBeDefined();

    await deleteNotification(testNotifications[0]);
    expect(mockSafeDeleteDataset).toBeCalledWith("TestUrl1");
  });

  test("Notification badge icon renders correctly and shows correct number of notifications", async () => {
    (RetrieveAllNotifications as jest.Mock).mockImplementation(() => {
      return notificationRetrieval;
    });
    const notificationElements = GetNotificationElements(
      "TestAddress",
      [],
      {},
      true,
      () => undefined
    );
    const notificationIcon = notificationElements.icon;
    expect(notificationIcon).toBeDefined();

    const notificationIconComponent = render(<>{notificationIcon}</>);
    expect(notificationIconComponent).toBeDefined();

    expect(
      notificationIconComponent.baseElement.innerHTML.includes("2")
    ).toBeTruthy();
  });
});
