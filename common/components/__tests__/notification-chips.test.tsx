import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  NotificationCreatedAtChip,
  NotificationTypeChip,
} from "../notification-chips";
import { NotificationType } from "../../types/NotificationsType";
import { Notification } from "../../types/Notification";

const testNotification: Notification = {
  notificationUrl: "TestUrl",
  isProcessed: true,
  type: NotificationType.BookingRequest,
  text: "TestMessage",
  createdAt: new Date("2021-07-03 16:33:25"),
  onClick: () => undefined,
  onReceive: () => undefined,
};

describe("<NotificationCreatedAtChip />, <NotificationTypeChip />", () => {
  test("<NotificationCreatedAtChip /> renders correctly and displays createdAt date", async () => {
    const createdAtComponent = render(
      <NotificationCreatedAtChip notification={testNotification} />
    );
    expect(createdAtComponent).toBeDefined();
    expect(
      createdAtComponent.baseElement.innerHTML.includes("2021-07-03")
    ).toBeTruthy();
    expect(
      createdAtComponent.baseElement.innerHTML.includes("16:33:25")
    ).toBeTruthy();
  });

  test("<NotificationTypeChip /> renders correctly and displays proper type label", async () => {
    const notificationTypeComponent = render(
      <NotificationTypeChip notification={testNotification} />
    );
    expect(notificationTypeComponent).toBeDefined();
    expect(
      notificationTypeComponent.baseElement.innerHTML.includes("Reservation")
    ).toBeTruthy();
  });
});
