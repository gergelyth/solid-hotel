import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { CheckoutButton } from "../checkout-button";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { SubmitCheckoutRequest } from "../../../util/outgoingCommunications";

jest.mock("../../../util/outgoingCommunications");

describe("<CheckoutButton />", () => {
  test("Renders correctly and calls the right method", async () => {
    const onClickFunction = jest.fn();

    const checkoutButtonComponent = render(
      <CheckoutButton
        reservationId={"reservationId2"}
        reservations={TestReservations}
        onClickFunction={onClickFunction}
      />
    );
    expect(checkoutButtonComponent).toBeDefined();

    const checkoutButton = checkoutButtonComponent.queryByTestId(
      "checkout-button"
    ) as Element;
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toBeEnabled();

    await userEvent.click(checkoutButton);

    expect(SubmitCheckoutRequest).toBeCalledWith(TestReservations[1]);
    expect(onClickFunction).toBeCalled();
  });
});
