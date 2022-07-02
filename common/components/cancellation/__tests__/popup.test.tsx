import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
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

jest.mock("../../reservations/hotel-details", () => {
  return {
    GetHotelInformation: () => null,
  };
});
jest.mock("../../reservations/stay-details", () => {
  return {
    GetStayInterval: () => null,
  };
});

function Render(
  isPopupShowing: boolean,
  setPopupVisibility: () => void,
  confirmCancellation: () => void
): RenderResult {
  return render(
    <CancelReservationPopup
      reservation={testReservation}
      isPopupShowing={isPopupShowing}
      setPopupVisibility={setPopupVisibility}
      confirmCancellation={confirmCancellation}
    />
  );
}

describe("<CancelReservationPopup />", () => {
  test("With dialog disabled doesn't render cancel button", async () => {
    const cancelReservationPopup = Render(
      false,
      () => undefined,
      () => undefined
    );
    expect(cancelReservationPopup).toBeDefined();
    const cancelReservationButton = cancelReservationPopup.queryByTestId(
      "cancel-reservation-button"
    );
    expect(cancelReservationButton).toBeNull();
  });

  test("With dialog enabled and verification checked calls confirmCancellation method", async () => {
    const setPopupVisibility = jest.fn();
    const confirmCancellation = jest.fn();
    const cancelReservationPopup = Render(
      true,
      setPopupVisibility,
      confirmCancellation
    );
    const cancelReservationButton = cancelReservationPopup.queryByTestId(
      "cancel-reservation-button"
    ) as Element;
    expect(cancelReservationButton).toBeDefined();
    expect(cancelReservationButton).toBeDisabled();

    const confirmationCheckbox = cancelReservationPopup.queryByTestId(
      "cancel-reservation-checkbox"
    ) as Element;
    expect(confirmationCheckbox).toBeDefined();
    expect(confirmationCheckbox).not.toBeChecked();

    await userEvent.click(confirmationCheckbox);
    expect(cancelReservationButton).toBeEnabled();

    await userEvent.click(cancelReservationButton);
    expect(confirmCancellation).toBeCalledWith(testReservation);
    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
