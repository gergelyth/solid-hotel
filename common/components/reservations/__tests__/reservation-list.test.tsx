import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReservationList } from "../reservation-list";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { useReservations } from "../../../hooks/useReservations";
import { ReservationState } from "../../../types/ReservationState";

const testReservations: ReservationAtHotel[] = [
  {
    id: "reservationId1",
    inbox: "CounterpartyInboxUrl",
    owner: "OwnerWebId",
    hotel: "HotelWebId",
    room: "RoomUrl",
    state: ReservationState.CONFIRMED,
    dateFrom: new Date("2021-07-03"),
    dateTo: new Date("2021-07-07"),
  },
  {
    id: "reservationId2",
    inbox: "CounterpartyInboxUrl",
    owner: "OwnerWebId",
    hotel: "HotelWebId",
    room: "RoomUrl",
    state: ReservationState.ACTIVE,
    dateFrom: new Date("2021-07-01"),
    dateTo: new Date("2021-07-02"),
  },
];

jest.mock("../../../hooks/useReservations", () => {
  return {
    useReservations: jest.fn(),
  };
});

const createReservationElement = (
  reservation: ReservationAtHotel
): JSX.Element => <>{reservation.id}</>;

function Render(
  reservationFilter: (reservation: ReservationAtHotel) => boolean
): RenderResult {
  return render(
    <ReservationList
      reservationsUrl={"TestReservationsUrl"}
      reservationFilter={reservationFilter}
      reservationElement={createReservationElement}
    />
  );
}

describe("<ReservationList />", () => {
  test("Renders correctly with empty reservation list", async () => {
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: [],
        isLoading: false,
        isError: false,
      };
    });
    const reservationListComponent = Render(() => false);
    expect(reservationListComponent).toBeDefined();
    expect(
      reservationListComponent.baseElement.innerHTML.includes(
        "No reservations found."
      )
    ).toBeTruthy();
  });

  test("Displays only reservations which match supplied filter", async () => {
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: testReservations,
        isLoading: false,
        isError: false,
      };
    });
    const reservationListComponent = Render(
      (reservation) => reservation.state === ReservationState.ACTIVE
    );
    expect(reservationListComponent).toBeDefined();
    expect(
      reservationListComponent.baseElement.innerHTML.includes("reservationId2")
    ).toBeTruthy();
    expect(
      reservationListComponent.baseElement.innerHTML.includes("reservationId1")
    ).toBeFalsy();
  });
});
