import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationType } from "../../types/NotificationsType";
import { Notification } from "../../types/Notification";
import { NotificationList } from "../notification-list";
import userEvent from "@testing-library/user-event";

const onClickFunction1 = jest.fn();
const onClickFunction2 = jest.fn();

const testNotifications: Notification[] = [
  {
    notificationUrl: "TestUrl1",
    isProcessed: true,
    type: NotificationType.BookingRequest,
    text: "TestMessage1",
    createdAt: new Date("2021-07-01 16:33:25"),
    onClick: onClickFunction1,
    onReceive: () => undefined,
  },
  {
    notificationUrl: "TestUrl2",
    isProcessed: true,
    type: NotificationType.PrivacyToken,
    text: "TestMessage2",
    createdAt: new Date("2021-07-03 12:34:11"),
    onClick: onClickFunction2,
    onReceive: () => undefined,
  },
];

const notificationRetrieval = {
  items: testNotifications,
  isLoading: false,
  isError: false,
};

describe("<NotificationList />", () => {
  test("Renders notifications correctly in descending order and calls expected delete and onClick actions when triggered", async () => {
    const deleteNotification = jest.fn();
    const notificationListComponent = render(
      <NotificationList
        notificationRetrieval={notificationRetrieval}
        deleteNotification={deleteNotification}
      />
    );
    expect(notificationListComponent).toBeDefined();

    const notificationCards =
      notificationListComponent.queryAllByTestId("notification-card");

    //They are rendered in descending order by time
    expect(
      notificationCards[0].innerHTML.includes("TestMessage2")
    ).toBeTruthy();
    expect(
      notificationCards[1].innerHTML.includes("TestMessage1")
    ).toBeTruthy();

    await userEvent.click(notificationCards[0] as Element);
    expect(onClickFunction2).toBeCalled();

    const firstDeleteButton = notificationListComponent.queryAllByTestId(
      "notification-delete-button"
    )[0] as Element;

    await userEvent.click(firstDeleteButton);
    expect(deleteNotification).toBeCalled();
  });
});
