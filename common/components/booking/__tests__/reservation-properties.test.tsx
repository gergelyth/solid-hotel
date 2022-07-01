import React, { Dispatch, SetStateAction } from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BookingProperties } from "../reservation-properties";

let setSelectedRoomId: Dispatch<SetStateAction<string>>;
jest.mock("../room-selector", () => {
  return {
    RoomSelector: (props: {
      selectedRoomId: string;
      setSelectedRoomId: Dispatch<SetStateAction<string>>;
    }) => {
      setSelectedRoomId = props.setSelectedRoomId;
      return null;
    },
  };
});
jest.mock("../date-selector", () => {
  return {
    DateSelector: () => null,
  };
});

function Render(
  onSelectActionFunction: () => void = () => undefined
): RenderResult {
  return render(<BookingProperties onSelectAction={onSelectActionFunction} />);
}

describe("<BookingProperties />", () => {
  test("Renders without issue", async () => {
    const bookingProperties = Render();
    expect(bookingProperties).not.toBeUndefined();
  });

  test("Trigger booking action on button click", async () => {
    const bookingActionCallback = jest.fn();
    const bookingProperties = Render(bookingActionCallback);

    const button = bookingProperties.queryByTestId(
      "select-reservation-button"
    ) as Element;
    expect(button).toBeInTheDocument();

    expect(button).toBeDisabled();

    act(() => {
      setSelectedRoomId("roomId1");
    });
    expect(button).not.toBeDisabled();

    await userEvent.click(button);
    expect(bookingActionCallback).toBeCalled();
  });
});
