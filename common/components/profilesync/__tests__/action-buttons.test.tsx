import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { SendChangeActionButtons } from "../action-buttons";

function Render(
  isDisabled: boolean,
  requiresApproval: boolean,
  approveButtonAction: () => void,
  closeSnackbar: () => void
): RenderResult {
  return render(
    <SendChangeActionButtons
      isSendButtonDisabled={isDisabled}
      requiresApproval={requiresApproval}
      label={"TestLabel"}
      approveButtonAction={approveButtonAction}
      closeSnackbar={closeSnackbar}
    />
  );
}

describe("<SendChangeActionButtons />", () => {
  test("With approval required renders both buttons correctly and send button is disabled if instructed", async () => {
    const sendButtonComponent = Render(true, true, jest.fn(), jest.fn());

    const cancelButton = sendButtonComponent.queryByTestId(
      "cancel-button"
    ) as Element;
    expect(cancelButton).toBeDefined();
    expect(cancelButton).toBeEnabled();

    const sendButton = sendButtonComponent.queryByTestId(
      "send-button"
    ) as Element;
    expect(sendButton).toBeDefined();
    expect(sendButton).toBeDisabled();
  });

  test("With approval required renders both buttons correctly and send button click calls approve action", async () => {
    const approveButtonAction = jest.fn();
    const closeSnackbar = jest.fn();
    const sendButtonComponent = Render(
      false,
      true,
      approveButtonAction,
      closeSnackbar
    );

    const cancelButton = sendButtonComponent.queryByTestId(
      "cancel-button"
    ) as Element;
    expect(cancelButton).toBeDefined();
    await userEvent.click(cancelButton);
    expect(closeSnackbar).toBeCalled();

    const sendButton = sendButtonComponent.queryByTestId(
      "send-button"
    ) as Element;
    expect(sendButton).toBeDefined();
    expect(sendButton).toBeEnabled();

    await userEvent.click(sendButton);
    expect(approveButtonAction).toBeCalled();
  });

  test("With approval not required only OK button is rendered", async () => {
    const sendButtonComponent = Render(false, false, jest.fn(), jest.fn());

    const cancelButton = sendButtonComponent.queryByTestId(
      "cancel-button"
    ) as Element;
    expect(cancelButton).toBeInTheDocument();

    const sendButton = sendButtonComponent.queryByTestId(
      "send-button"
    ) as Element;
    expect(sendButton).not.toBeInTheDocument();
  });
});
