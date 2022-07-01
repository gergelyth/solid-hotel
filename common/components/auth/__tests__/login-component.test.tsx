import React from "react";
import { Session, ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { render, RenderResult } from "@testing-library/react";
import LoginButtonComponent from "../login-component";
import { mocked } from "ts-jest/utils";
import "@testing-library/jest-dom";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

jest.mock("@inrupt/solid-client-authn-browser", () => {
  return {
    __esModule: true,
    getDefaultSession: jest.fn(),
    handleIncomingRedirect: () => undefined,
    onLogin: () => undefined,
    onSessionRestore: () => undefined,
  };
});

function MockSession(isLoggedIn: boolean): Session {
  const sessionInfo: ISessionInfo = {
    isLoggedIn: isLoggedIn,
    sessionId: "dummy",
  };
  const mockSession = mocked({
    info: sessionInfo,
  } as unknown as Session);
  return mockSession;
}

function Render(): RenderResult {
  return render(<LoginButtonComponent />);
}

beforeEach(() => {
  //Default implementation
  (getDefaultSession as jest.Mock).mockImplementation(() => MockSession(false));
});

describe("<LoginButtonComponent />", () => {
  test("Renders without issue", async () => {
    const button = Render();
    expect(button).not.toBeUndefined();
  });

  test("Renders login button if user is logged out", async () => {
    const button = Render();
    expect(button.queryByTestId("login-button")).toBeInTheDocument();
    expect(button.queryByTestId("logout-button")).not.toBeInTheDocument();
  });

  test("Renders logout button if user is logged in", async () => {
    (getDefaultSession as jest.Mock).mockImplementation(() =>
      MockSession(true)
    );
    const button = Render();
    expect(button.queryByTestId("logout-button")).toBeInTheDocument();
    expect(button.queryByTestId("login-button")).not.toBeInTheDocument();
  });
});
