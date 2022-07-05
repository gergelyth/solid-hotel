import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { useReservations } from "../../../hooks/useReservations";
import { ReservationState } from "../../../types/ReservationState";
import { ReservationStatusList } from "../reservation-status-list";

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

function Render(): RenderResult {
  return render(
    <ReservationStatusList
      reservationsUrl={"TestReservationsUrl"}
      reservationFilter={(state: ReservationState) =>
        state === ReservationState.ACTIVE
      }
      reservationsTitle={"TestReservationsTitle"}
      createReservationElement={createReservationElement}
    />
  );
}

describe("<ReservationStatusList />", () => {
  test("Renders correctly and displays only reservations which have the supplied state", async () => {
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: testReservations,
        isLoading: false,
        isError: false,
      };
    });

    const reservationStatusListComponent = Render();
    expect(reservationStatusListComponent).toBeDefined();

    expect(
      reservationStatusListComponent.baseElement.innerHTML.includes(
        "TestReservationsTitle"
      )
    ).toBeTruthy();
    expect(
      reservationStatusListComponent.baseElement.innerHTML.includes(
        "reservationId2"
      )
    ).toBeTruthy();
    expect(
      reservationStatusListComponent.baseElement.innerHTML.includes(
        "reservationId1"
      )
    ).toBeFalsy();
  });
});
