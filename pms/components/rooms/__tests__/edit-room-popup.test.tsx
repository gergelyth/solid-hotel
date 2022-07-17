import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { EditRoomPopup } from "../edit-room-popup";
import { RoomDefinition } from "../../../../common/types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../util/solidHotelSpecific";

const testRoom: RoomDefinition = {
  id: "RoomId1",
  name: "RoomName",
  description: "Description",
};

jest.mock("../../../util/solidHotelSpecific", () => {
  return {
    CreateOrUpdateRoom: jest.fn(),
  };
});

function Render(
  updateRoomLocally: () => void,
  isPopupShowing: boolean,
  setPopupVisibility: () => void
): RenderResult {
  return render(
    <EditRoomPopup
      room={testRoom}
      updateRoomLocally={updateRoomLocally}
      isPopupShowing={isPopupShowing}
      setPopupVisibility={setPopupVisibility}
    />
  );
}

describe("<EditRoomPopup />", () => {
  test("With dialog disabled doesn't render edit button", async () => {
    const editRoomPopup = Render(
      () => undefined,
      false,
      () => undefined
    );
    expect(editRoomPopup).toBeDefined();
    const editRoomButton = editRoomPopup.queryByTestId(
      "edit-room-popup-button"
    );
    expect(editRoomButton).toBeNull();
  });

  test("With dialog enabled button click calls updateRoom method and hides dialog", async () => {
    const setPopupVisibility = jest.fn();
    const updateRoom = jest.fn();
    const editRoomPopup = Render(updateRoom, true, setPopupVisibility);

    const editRoomButton = editRoomPopup.queryByTestId(
      "edit-room-popup-button"
    ) as Element;
    expect(editRoomButton).toBeDefined();
    expect(editRoomButton).toBeEnabled();

    await userEvent.click(editRoomButton);

    const newRoom = {
      ...testRoom,
      id: null,
    };
    expect(updateRoom).toBeCalledWith(newRoom, false);
    expect(CreateOrUpdateRoom).toBeCalledWith(newRoom);
    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
