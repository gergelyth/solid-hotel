import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginProviders from "../login-providers";
import userEvent from "@testing-library/user-event";
import { SolidLogin } from "../../../util/solid";

jest.mock("../dynamic-handle-redirect-component", () => {
  return {
    DynamicHandleRedirectComponent: () => null,
  };
});
jest.mock("../../../util/solid");

function Render(): RenderResult {
  return render(<LoginProviders />);
}

describe("<LoginProviders />", () => {
  test("Renders without issue", async () => {
    const providers = Render();
    expect(providers).not.toBeUndefined();
  });

  test("Renders built-in Inrupt provider", async () => {
    const providers = Render();
    expect(
      providers.queryByTestId("inrupt-provider-button")
    ).toBeInTheDocument();
  });

  test("Custom provider input and button work as expected", async () => {
    const providers = Render();
    const textField = providers.queryByTestId(
      "custom-provider-textfield"
    ) as Element;
    expect(textField).toBeInTheDocument();
    const textFieldInput = textField.querySelector("input") as Element;

    const button = providers.queryByTestId("custom-provider-button") as Element;
    expect(button).toBeInTheDocument();

    const customProviderAddress = "https://customprovider.net";

    await userEvent.type(textFieldInput, customProviderAddress);
    await userEvent.click(button);

    expect(SolidLogin).toBeCalledWith(customProviderAddress);

    const invalidProviderAddress = "InvalidProviderUrl";
    await userEvent.clear(textFieldInput);
    await userEvent.type(textFieldInput, invalidProviderAddress);
    await userEvent.click(button);

    expect(SolidLogin).not.toBeCalledWith(invalidProviderAddress);
  });
});
