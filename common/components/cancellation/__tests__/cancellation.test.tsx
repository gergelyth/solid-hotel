import React, { Dispatch, SetStateAction } from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { CancelReservationButton } from "../cancellation";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { ReservationState } from "../../../types/ReservationState";
import { GetToday, GetTomorrow } from "../../../util/helpers";
import { CancelReservationPopup } from "../popup";

const testReservation: ReservationAtHotel = {
  id: "reservationId1",
  inbox: "CounterpartyInboxUrl",
  owner: "OwnerWebId",
  hotel: "HotelWebId",
  room: "RoomUrl",
  state: ReservationState.CONFIRMED,
  dateFrom: GetToday(),
  dateTo: GetTomorrow(),
};

jest.mock("../popup", () => {
  return {
    CancelReservationPopup: jest.fn(),
  };
});

function Render(): RenderResult {
  return render(
    <CancelReservationButton
      reservation={testReservation}
      confirmCancellation={() => undefined}
    />
  );
}

describe("<CancelReservationButton />", () => {
  test("Renders with popup disabled by default", async () => {
    (CancelReservationPopup as jest.Mock).mockImplementation(
      (props: {
        reservation: ReservationAtHotel;
        isPopupShowing: boolean;
        setPopupVisibility: Dispatch<SetStateAction<boolean>>;
        confirmCancellation: (reservation: ReservationAtHotel) => void;
      }) => {
        expect(props.isPopupShowing).toBeFalsy();
        return null;
      }
    );

    const cancelReservationButton = Render();
    expect(cancelReservationButton).toBeDefined();
  });

  test("Cancel button click displays cancel popup", async () => {
    let expectedIsPopupShowingValue = false;
    (CancelReservationPopup as jest.Mock).mockImplementation(
      (props: {
        reservation: ReservationAtHotel;
        isPopupShowing: boolean;
        setPopupVisibility: Dispatch<SetStateAction<boolean>>;
        confirmCancellation: (reservation: ReservationAtHotel) => void;
      }) => {
        expect(props.isPopupShowing).toEqual(expectedIsPopupShowingValue);
        return null;
      }
    );

    const cancelReservationButton = Render();
    const button = cancelReservationButton.queryByTestId(
      "show-cancel-popup-button"
    ) as Element;

    expectedIsPopupShowingValue = true;
    await userEvent.click(button);
  });
});
