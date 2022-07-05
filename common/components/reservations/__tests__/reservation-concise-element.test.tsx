import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReservationConciseElement } from "../reservation-concise-element";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { ReservationState } from "../../../types/ReservationState";
import userEvent from "@testing-library/user-event";

const testReservation: ReservationAtHotel = {
  id: "reservationId1",
  inbox: "CounterpartyInboxUrl",
  owner: "OwnerWebId",
  hotel: "HotelWebId",
  room: "RoomUrl",
  state: ReservationState.CONFIRMED,
  dateFrom: new Date("2021-07-03"),
  dateTo: new Date("2021-07-07"),
};

function Render(onClickAction: () => void): RenderResult {
  return render(
    <ReservationConciseElement
      reservation={testReservation}
      titleElement={<></>}
      onClickAction={onClickAction}
    />
  );
}

describe("<ReservationConciseElement />", () => {
  test("Renders correctly, displays required information and triggers click event on button click", async () => {
    const onClickAction = jest.fn();
    const reservationElement = Render(onClickAction);
    expect(reservationElement).toBeDefined();

    expect(
      reservationElement.baseElement.innerHTML.includes("4 nights")
    ).toBeTruthy();
    expect(
      reservationElement.baseElement.innerHTML.includes(
        "July 3rd, 2021 - July 7th, 2021"
      )
    ).toBeTruthy();

    const cardElement = reservationElement.queryByTestId(
      "reservation-concise-element-card"
    ) as Element;

    await userEvent.click(cardElement);
    expect(onClickAction).toBeCalled();
  });
});
