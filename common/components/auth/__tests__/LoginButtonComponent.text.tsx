import React from "react";
import { Session, ISessionInfo } from "@inrupt/solid-client-authn-browser";
import { render, RenderResult } from "@testing-library/react";
import LoginButtonComponent from "../login-component";
import { mocked } from "ts-jest/utils";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

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

jest.mock("@inrupt/solid-client-authn-browser", () => {
  return {
    __esModule: true,
    getDefaultSession: jest.fn(),
    handleIncomingRedirect: () => undefined,
    onLogin: () => undefined,
    onSessionRestore: () => undefined,
  };
});

function Render(): RenderResult {
  return render(<LoginButtonComponent />);
}

beforeEach(() => {
  //Default implementation
  getDefaultSession.mockImplementation(() => MockSession(false));
});

describe("<LoginButtonComponent />", () => {
  test("Should render", async () => {
    const button = Render();
    expect(button).not.toBeUndefined();
  });
  test("Should render login button if user is logged out", async () => {
    const button = Render();
    const loginButton = await button.findByTestId("login");
    expect(loginButton).not.toBeUndefined();
  });
  test("Should render logout button if user is logged in", async () => {
    getDefaultSession.mockImplementation(() => MockSession(true));
    const button = Render();
    const loginButton = await button.findByTestId("logout");
    expect(loginButton).not.toBeUndefined();
  });
});
