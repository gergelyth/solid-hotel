import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomDefinition } from "../../../../common/types/RoomDefinition";
import { EditableRoomElement } from "../editable-room";

const testRoom: RoomDefinition = {
  id: "RoomId1",
  name: "RoomName",
  description: "Description",
};

function Render(): RenderResult {
  return render(
    <EditableRoomElement
      room={testRoom}
      key={"TestKey"}
      updateRoomLocally={() => undefined}
    />
  );
}

describe("<EditableRoomElement />", () => {
  test("Renders all elements without error", async () => {
    const editableRoomElement = Render();

    const editRoomButton = editableRoomElement.queryByTestId(
      "edit-button"
    ) as Element;
    expect(editRoomButton).toBeDefined();
    expect(editRoomButton).toBeEnabled();

    const deleteRoomButton = editableRoomElement.queryByTestId(
      "delete-button"
    ) as Element;
    expect(deleteRoomButton).toBeDefined();
    expect(deleteRoomButton).toBeEnabled();

    expect(
      editableRoomElement.baseElement.innerHTML.includes(testRoom.name)
    ).toBeTruthy();
    expect(
      editableRoomElement.baseElement.innerHTML.includes(
        testRoom.description ?? ""
      )
    ).toBeTruthy();
  });
});
