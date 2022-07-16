import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { ReservationRadioSelector } from "../radio-reservation-selector";

jest.mock("../../../../common/components/reservations/hotel-details", () => {
  return {
    HotelDetailsOneLiner: jest.fn(() => null),
  };
});

describe("<ReservationRadioSelector />", () => {
  test("Renders correctly and switches reservation in state when prompted", async () => {
    const setSelectedReservationId = jest.fn();

    const radioComponent = render(
      <ReservationRadioSelector
        selectedReservationId={"reservationId2"}
        setSelectedReservationId={setSelectedReservationId}
        filteredReservations={TestReservations}
      />
    );
    expect(radioComponent).toBeDefined();

    await userEvent.click(screen.getByText("4 nights"));

    expect(setSelectedReservationId).toBeCalledWith("reservationId1");
  });
});
