import { Session } from "@inrupt/solid-client-authn-browser";
import { mocked } from "ts-jest/utils";
import "@testing-library/jest-dom";
import { IgnoreNextUpdate, Subscribe, UnSubscribe } from "../tracker";
import { Subscriber } from "../../../types/WebSocketResource";

const webSocket = mocked({
  readyState: undefined,
  send: jest.fn(),
  close: jest.fn(),
} as unknown as WebSocket);

jest.mock("../../solid", () => {
  return {
    GetSession: jest.fn(() => MockSession()),
  };
});

const mockFetch = jest.fn(() => MockResponse());

function MockSession(): Session {
  const mockSession = mocked({
    fetch: mockFetch,
  } as unknown as Session);
  return mockSession;
}

function MockResponse(): Response {
  const headers = new Headers([
    ["Updates-Via", "wss://www.example.com/socketserver"],
  ]);
  const mockResponse = mocked({
    headers: headers,
  } as unknown as Response);
  return mockResponse;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("tracker", () => {
  test("Subscribe initializes WebSocket correctly and calls appropriate methods on message receive + UnSubscribe closes the WebSocket", async () => {
    const mock = jest.spyOn(global, "WebSocket");
    mock.mockImplementation(() => webSocket);
    const mockSubscriber: Subscriber = {
      onClick: jest.fn(),
      onReceive: jest.fn(),
    };
    await Subscribe("TestResourceUrl", mockSubscriber);

    expect(WebSocket).toBeCalledWith("wss://www.example.com/socketserver");
    expect(webSocket.send).toBeCalledWith("sub TestResourceUrl");

    expect(webSocket.onmessage).not.toBeNull();
    if (webSocket.onmessage === null) {
      return;
    }

    const mockMessage = mocked({
      data: "pub TestResourceUrl",
    } as unknown as MessageEvent);
    webSocket.onmessage(mockMessage);

    expect(mockSubscriber.onReceive).toBeCalledTimes(1);
    expect(mockSubscriber.onReceive).toBeCalledWith("TestResourceUrl");

    UnSubscribe("TestResourceUrl");
    expect(webSocket.close).toBeCalled();
  });

  test("IgnoreNextUpdate ignores next message but recognizes the one after that", async () => {
    const mock = jest.spyOn(global, "WebSocket");
    mock.mockImplementation(() => webSocket);
    const mockSubscriber: Subscriber = {
      onClick: jest.fn(),
      onReceive: jest.fn(),
    };
    await Subscribe("TestResourceUrl", mockSubscriber);

    expect(WebSocket).toBeCalledWith("wss://www.example.com/socketserver");
    expect(webSocket.send).toBeCalledWith("sub TestResourceUrl");

    expect(webSocket.onmessage).not.toBeNull();
    if (webSocket.onmessage === null) {
      return;
    }

    const mockGoodMessage = mocked({
      data: "pub GoodMessage",
    } as unknown as MessageEvent);

    const mockIgnoredMessage = mocked({
      data: "pub IgnoredMessage",
    } as unknown as MessageEvent);

    webSocket.onmessage(mockGoodMessage);
    expect(mockSubscriber.onReceive).toHaveBeenNthCalledWith(1, "GoodMessage");

    IgnoreNextUpdate("TestResourceUrl");
    webSocket.onmessage(mockIgnoredMessage);
    expect(mockSubscriber.onReceive).not.toBeCalledWith("IgnoredMessage");

    webSocket.onmessage(mockGoodMessage);
    expect(mockSubscriber.onReceive).toHaveBeenNthCalledWith(2, "GoodMessage");
  });
});
