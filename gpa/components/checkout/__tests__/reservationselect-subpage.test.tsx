import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { useReservations } from "../../../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../../../common/types/ReservationAtHotel";
import { ReservationSelectForCheckout } from "../reservationselect-subpage";
import { CheckoutPage } from "../../../pages/checkout";

let checkoutButtonProps: {
  reservationId: string;
  reservations: ReservationAtHotel[];
  onClickFunction: () => void;
};
jest.mock("../checkout-button", () => {
  return {
    CheckoutButton: jest.fn((props) => {
      checkoutButtonProps = props;
      return null;
    }),
  };
});

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

jest.mock("../radio-reservation-selector", () => {
  return {
    ReservationRadioSelector: jest.fn(() => null),
  };
});

describe("<ReservationSelectForCheckout />", () => {
  test("Renders correctly and calls components and functions with correct arguments", async () => {
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: TestReservations,
        isLoading: false,
        isError: false,
      };
    });

    const setCurrentPage = jest.fn();
    const reservationSelect = render(
      <ReservationSelectForCheckout
        currentPage={CheckoutPage.ReservationSelect}
        setCurrentPage={setCurrentPage}
      />
    );
    expect(reservationSelect).toBeDefined();

    expect(useReservations).toBeCalledWith(
      "https://testpodurl.com/reservations/"
    );

    checkoutButtonProps.onClickFunction();

    expect(setCurrentPage).toBeCalledWith(CheckoutPage.Finish);
  });
});
