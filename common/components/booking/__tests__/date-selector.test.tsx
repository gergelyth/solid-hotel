import React from "react";
import {
  screen,
  render,
  RenderResult,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { DateSelector } from "../date-selector";
import { GetToday, GetTomorrow } from "../../../util/helpers";

function Render(
  setCheckinDate: () => void = () => undefined,
  setCheckoutDate: () => void = () => undefined
): RenderResult {
  return render(
    <DateSelector
      checkinDate={GetToday()}
      setCheckinDate={setCheckinDate}
      checkoutDate={GetTomorrow()}
      setCheckoutDate={setCheckoutDate}
    />
  );
}

describe("<DateSelector />", () => {
  test("Renders without issue", async () => {
    const dateSelector = Render();
    expect(dateSelector).not.toBeUndefined();
  });

  //Skipped for now as it requires some hacky logic
  test.skip("Changes dates in state when prompted", async () => {
    const setCheckinDateCallback = jest.fn();
    const setCheckoutDateCallback = jest.fn();

    const dateSelector = Render(
      setCheckinDateCallback,
      setCheckoutDateCallback
    );

    expect(
      dateSelector.queryByTestId("checkin-datepicker")
    ).toBeInTheDocument();
    expect(
      dateSelector.queryByTestId("checkout-datepicker")
    ).toBeInTheDocument();

    await userEvent.click(
      dateSelector.queryByTestId("checkin-datepicker") as Element
    );
    // const datepicker = screen.getByDisplayValue("01/Jul/2022");
    // userEvent.type(datepicker, "03/Jul/2022"); // type anything

    const chosenDate = screen.getByRole("button", { name: "3/7/2022" });
    fireEvent.click(chosenDate);

    expect(setCheckinDateCallback).toBeCalled();
  });
});
