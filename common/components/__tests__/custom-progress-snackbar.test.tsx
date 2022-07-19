import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CustomProgressSnackbar } from "../custom-progress-snackbar";

const snackbarTestMessage = "TestMessage";

function Render(): RenderResult {
  return render(
    <CustomProgressSnackbar
      snackbarKey={"TestKey"}
      message={snackbarTestMessage}
    />
  );
}

describe("<CustomProgressSnackbar />", () => {
  test("Renders correctly and displays message and loading bar", async () => {
    const snackbarComponent = Render();
    expect(snackbarComponent).toBeDefined();
    expect(
      snackbarComponent.baseElement.innerHTML.includes(snackbarTestMessage)
    ).toBeTruthy();
    expect(snackbarComponent.queryByRole("progressbar")).toBeInTheDocument();
  });
});
