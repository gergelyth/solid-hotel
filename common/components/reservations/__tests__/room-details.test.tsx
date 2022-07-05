import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomDetails } from "../room-details";

const testRoom = {
  id: "roomId1",
  name: "Room 1",
  description: "Description 1",
};

jest.mock("../../../hooks/useRooms", () => {
  return {
    useSpecificRoom: () => {
      return {
        room: testRoom,
        isLoading: false,
        isError: false,
      };
    },
  };
});

function Render(): RenderResult {
  return render(<RoomDetails roomUrl={"TestRoomUrl"} />);
}

describe("<RoomDetails />", () => {
  test("Renders correctly and displays information", async () => {
    const roomDetailsComponent = Render();
    expect(roomDetailsComponent).toBeDefined();
    expect(
      roomDetailsComponent.baseElement.innerHTML.includes(testRoom.name)
    ).toBeTruthy();
    expect(
      roomDetailsComponent.baseElement.innerHTML.includes(testRoom.description)
    ).toBeTruthy();
  });
});
