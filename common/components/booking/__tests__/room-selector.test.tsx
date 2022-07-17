import React from "react";
import { screen, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { RoomSelector } from "../room-selector";
import { TestRoomDefinitions } from "../../../util/__tests__/testUtil";

jest.mock("../../../hooks/useRooms", () => {
  return {
    useRooms: () => {
      return {
        items: TestRoomDefinitions,
        isLoading: false,
        isError: false,
        isValidating: false,
      };
    },
  };
});

function Render(
  selectedRoomId = "roomId1",
  setSelectedRoomId: () => void = () => undefined
): RenderResult {
  return render(
    <RoomSelector
      selectedRoomId={selectedRoomId}
      setSelectedRoomId={setSelectedRoomId}
    />
  );
}

describe("<RoomSelector />", () => {
  test("Renders list of rooms with mock API call without issue", async () => {
    const roomSelector = Render();
    expect(roomSelector).not.toBeUndefined();
  });

  test("Switches room in state when prompted", async () => {
    const roomSwitchCallback = jest.fn();
    const roomSelector = Render("roomId2", roomSwitchCallback);

    expect(
      roomSelector.queryByTestId("room-selector-radio")
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("roomId2")).toBeChecked();
    expect(screen.getByDisplayValue("roomId3")).not.toBeChecked();

    await userEvent.click(screen.getByDisplayValue("roomId3"));

    expect(roomSwitchCallback).toBeCalledWith("roomId3");
  });
});
