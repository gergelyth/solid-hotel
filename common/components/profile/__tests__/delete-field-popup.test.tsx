import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { DeleteFieldPopup } from "../delete-field-popup";

const testFieldName = "TestFieldName1";

function Render(
  onConfirmation: () => void,
  isPopupShowing: boolean,
  setPopupVisibility: () => void
): RenderResult {
  return render(
    <DeleteFieldPopup
      fieldName={testFieldName}
      onConfirmation={onConfirmation}
      isPopupShowing={isPopupShowing}
      setPopupVisibility={setPopupVisibility}
    />
  );
}

describe("<DeleteFieldPopup />", () => {
  test("With dialog disabled doesn't render delete button", async () => {
    const deleteFieldPopup = Render(
      () => undefined,
      false,
      () => undefined
    );
    expect(deleteFieldPopup).toBeDefined();
    const deleteFieldButton = deleteFieldPopup.queryByTestId(
      "delete-field-popup-button"
    );
    expect(deleteFieldButton).toBeNull();
  });

  test("With dialog enabled button click calls deleteField method and hides dialog", async () => {
    const setPopupVisibility = jest.fn();
    const onConfirmation = jest.fn();
    const deleteFieldPopup = Render(onConfirmation, true, setPopupVisibility);

    const deleteFieldButton = deleteFieldPopup.queryByTestId(
      "delete-field-popup-button"
    ) as Element;
    expect(deleteFieldButton).toBeDefined();

    await userEvent.click(deleteFieldButton);
    expect(onConfirmation).toBeCalledWith(testFieldName);
    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
