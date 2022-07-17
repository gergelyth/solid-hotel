import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomList } from "../room-list";
import { TestRoomDefinitions } from "../../../../common/util/__tests__/testUtil";
import { useRooms } from "../../../../common/hooks/useRooms";
import { EditableRoomElement } from "../editable-room";

jest.mock("../../../../common/hooks/useRooms", () => {
  return {
    useRooms: jest.fn(),
    TriggerRefetch: jest.fn(),
  };
});
jest.mock("../editable-room", () => {
  return {
    EditableRoomElement: jest.fn(() => null),
  };
});

function Render(): RenderResult {
  return render(<RoomList />);
}

describe("<RoomList />", () => {
  test("Renders the correct number of rooms", async () => {
    (useRooms as jest.Mock).mockReturnValue({
      items: TestRoomDefinitions,
      isLoading: false,
      isError: false,
      isValidating: false,
    });

    const roomList = Render();

    expect(EditableRoomElement).toBeCalledTimes(3);

    const createRoomButton = roomList.queryByTestId(
      "create-room-button"
    ) as Element;
    expect(createRoomButton).toBeDefined();
    expect(createRoomButton).toBeEnabled();
  });
});
