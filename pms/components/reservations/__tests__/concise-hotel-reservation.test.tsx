import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  TestReservations,
  TestRoomDefinitions,
} from "../../../../common/util/__tests__/testUtil";
import { ConciseHotelReservationElement } from "../concise-hotel-reservation";
import { ReservationAtHotel } from "../../../../common/types/ReservationAtHotel";
import { useSpecificRoom } from "../../../../common/hooks/useRooms";

let reservationElementProps: {
  reservation: ReservationAtHotel;
  titleElement: JSX.Element;
  onClickAction: () => void;
};
jest.mock(
  "../../../../common/components/reservations/reservation-concise-element",
  () => {
    return {
      ReservationConciseElement: jest.fn((props) => {
        reservationElementProps = props;
        return null;
      }),
    };
  }
);

jest.mock("../../../../common/hooks/useRooms", () => {
  return {
    useSpecificRoom: jest.fn(),
  };
});

describe("<ConciseHotelReservationElement />", () => {
  test("Calls reservation element with correct props", async () => {
    (useSpecificRoom as jest.Mock).mockReturnValue({
      room: TestRoomDefinitions[0],
      isLoading: false,
      isError: false,
    });

    const onClickAction = jest.fn();
    const reservationComponent = render(
      <ConciseHotelReservationElement
        reservation={TestReservations[0]}
        onClickAction={onClickAction}
      />
    );
    expect(reservationComponent).toBeDefined();

    const titleElement = render(reservationElementProps.titleElement);
    expect(titleElement.baseElement.innerHTML.includes("Room 1")).toBeTruthy();

    expect(reservationElementProps.reservation).toEqual(TestReservations[0]);
    expect(reservationElementProps.onClickAction).toEqual(onClickAction);
  });
});
