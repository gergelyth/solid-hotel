import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { TocPopup } from "../toc-popup";

describe("<TocPopup />", () => {
  test("Dialog doesn't show if false argument is passed", async () => {
    const tocPopup = render(
      <TocPopup isPopupShowing={false} setPopupVisibility={() => undefined} />
    );
    expect(tocPopup).toBeDefined();

    expect(tocPopup.queryByTestId("toc-dialog")).not.toBeInTheDocument();
  });

  test("Renders correctly and reacts to events correctly", async () => {
    const setPopupVisibility = jest.fn();

    const tocPopup = render(
      <TocPopup isPopupShowing={true} setPopupVisibility={setPopupVisibility} />
    );
    expect(tocPopup).toBeDefined();

    expect(tocPopup.queryByTestId("toc-dialog")).toBeInTheDocument();

    const okButton = tocPopup.queryByTestId("toc-ok-button") as Element;
    expect(okButton).toBeInTheDocument();

    await userEvent.click(okButton);

    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
