import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SuccessPage } from "../success-page";
import { NextRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import userEvent from "@testing-library/user-event";

const mockRouterPush = jest.fn();

function MockRouter(): NextRouter {
  const mockRouter = mocked({
    push: mockRouterPush,
  } as unknown as NextRouter);
  return mockRouter;
}

function Render(successText: string): RenderResult {
  return render(
    <SuccessPage successText={successText} router={MockRouter()} />
  );
}

describe("<SuccessPage />", () => {
  test("Renders correctly with return button", async () => {
    const successPage = Render("TestSuccessText");
    expect(successPage).not.toBeUndefined();

    expect(successPage.queryByText("Success")).toBeInTheDocument();
    expect(successPage.queryByText("TestSuccessText")).toBeInTheDocument();

    const returnButton = successPage.queryByTestId("return-button") as Element;
    expect(returnButton).toBeInTheDocument();

    await userEvent.click(returnButton);
    expect(mockRouterPush).toBeCalledWith("/");
  });
});
