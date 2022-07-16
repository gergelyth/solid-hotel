import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { useReservations } from "../../../../common/hooks/useReservations";
import { ReservationDetails } from "../reservation-details";
import { HotelDetailsTwoLiner } from "../../../../common/components/reservations/hotel-details";
import { RoomDetails } from "../../../../common/components/reservations/room-details";

jest.mock("../../../../common/util/solid", () => {
  return {
    GetPodOfSession: jest.fn(() => "https://testpodurl.com"),
  };
});

jest.mock("../../../../common/hooks/useReservations", () => {
  return {
    useReservations: jest.fn(),
  };
});

jest.mock("../../../../common/components/reservations/hotel-details", () => {
  return {
    HotelDetailsTwoLiner: jest.fn(() => null),
  };
});
jest.mock("../../../../common/components/reservations/room-details", () => {
  return {
    RoomDetails: jest.fn(() => null),
  };
});

function Render(setCurrentReservation: () => void): RenderResult {
  return render(
    <ReservationDetails
      reservationId={TestReservations[1].id ?? undefined}
      setCurrentReservation={setCurrentReservation}
    />
  );
}

describe("<ReservationDetails />", () => {
  test("Renders correctly and calls elements with correct arguments", async () => {
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: TestReservations,
        isLoading: false,
        isError: false,
      };
    });

    const setCurrentReservation = jest.fn();
    const reservationDetails = Render(setCurrentReservation);
    expect(reservationDetails).toBeDefined();

    expect(useReservations).toBeCalledWith(
      "https://testpodurl.com/reservations/"
    );
    expect(setCurrentReservation).toBeCalledWith(TestReservations[1]);

    expect(HotelDetailsTwoLiner).toBeCalledWith(
      { hotelWebId: "HotelWebId2" },
      {}
    );
    expect(RoomDetails).toBeCalledWith({ roomUrl: "RoomUrl2" }, {});

    expect(
      reservationDetails.baseElement.innerHTML.includes("1 nights")
    ).toBeTruthy();
    expect(
      reservationDetails.baseElement.innerHTML.includes(
        "July 15th, 2021 - July 16th, 2021"
      )
    ).toBeTruthy();
  });
});
