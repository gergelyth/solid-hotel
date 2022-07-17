import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { DeleteRoomPopup } from "../delete-room-popup";
import { RoomDefinition } from "../../../../common/types/RoomDefinition";
import { DeleteRoom } from "../../../util/solidHotelSpecific";

const testRoom: RoomDefinition = {
  id: "RoomId1",
  name: "RoomName",
  description: "Description",
};

jest.mock("../../../util/solidHotelSpecific", () => {
  return {
    DeleteRoom: jest.fn(),
  };
});

function Render(
  updateRoomLocally: () => void,
  isPopupShowing: boolean,
  setPopupVisibility: () => void
): RenderResult {
  return render(
    <DeleteRoomPopup
      room={testRoom}
      updateRoomLocally={updateRoomLocally}
      isPopupShowing={isPopupShowing}
      setPopupVisibility={setPopupVisibility}
    />
  );
}

describe("<DeleteRoomPopup />", () => {
  test("With dialog disabled doesn't render delete button", async () => {
    const deleteRoomPopup = Render(
      () => undefined,
      false,
      () => undefined
    );
    expect(deleteRoomPopup).toBeDefined();
    const deleteRoomButton = deleteRoomPopup.queryByTestId(
      "delete-room-popup-button"
    );
    expect(deleteRoomButton).toBeNull();
  });

  test("With dialog enabled button click calls updateRoom method and hides dialog", async () => {
    const setPopupVisibility = jest.fn();
    const updateRoomLocally = jest.fn();
    const deleteRoomPopup = Render(updateRoomLocally, true, setPopupVisibility);

    const deleteRoomButton = deleteRoomPopup.queryByTestId(
      "delete-room-popup-button"
    ) as Element;
    expect(deleteRoomButton).toBeDefined();
    expect(deleteRoomButton).toBeDisabled();

    const confirmationCheckbox = deleteRoomPopup.queryByTestId(
      "delete-room-checkbox"
    ) as Element;
    expect(confirmationCheckbox).toBeDefined();
    expect(confirmationCheckbox).not.toBeChecked();

    await userEvent.click(confirmationCheckbox);
    expect(deleteRoomButton).toBeEnabled();

    await userEvent.click(deleteRoomButton);
    expect(updateRoomLocally).toBeCalledWith(testRoom, true);
    expect(DeleteRoom).toBeCalledWith(testRoom);
    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
