import { Subscriber, WebSocketResource } from "../../types/WebSocketResource";
import { GetSession } from "../solid";

/** A map of host URL to WebSocket instance and its subscribers to keep track of them. */
const webSockets: { [host: string]: WebSocketResource } = {};

/** Keeps track of the sockets which should ignore the next update. */
const oneTimeIgnoreSockets = new Set<string>();

/**
 * Main entrypoint for initializing a tracking functionality for a given resource.
 * Creates the WebSocket instance if required, initializes it and sets it up to call the subscriber methods when a PUB message is received.
 */
export async function Subscribe(
  url: string,
  subscriber: Subscriber
): Promise<void> {
  // Create a new subscription to the resource if none existed
  //   url = url.replace(/#.*/, "");
  await TrackResource(url, subscriber);
}

/**
 * Closes the WebSocket assigned to the resource URL in order to no longer receive notifications of changes.
 */
export function UnSubscribe(url: string): void {
  const webSocketResource = webSockets[url];
  if (!webSocketResource) {
    console.log(
      `Websocket [${url}] not found in websocket list. Can't unsubscribe`
    );
    return;
  }

  webSocketResource.webSocket.close();
  delete webSockets[url];
}

/**
 * Instruct the tracker to ignore the next message that gets received and don't call the subscriber onReceive method.
 * Used when the system is about to do the next profile update in order to avoid endless cyclical notifications.
 */
export function IgnoreNextUpdate(url: string): void {
  oneTimeIgnoreSockets.add(url);
}

/**
 * Initialize the WebSocket and open it to be able to receive messages.
 */
async function TrackResource(
  url: string,
  subscriber: Subscriber
): Promise<void> {
  // Obtain a WebSocket for the given host
  if (!(url in webSockets)) {
    webSockets[url] = await CreateWebSocket(url);
  }

  const webSocketResource = webSockets[url];
  webSocketResource.subscribers.add(subscriber);

  // Track subscribed resources to resubscribe later if needed
  // Subscribe to updates on the resource
  while (webSocketResource.webSocket.readyState !== WebSocket.OPEN) {
    await WaitFor(100);
  }

  webSocketResource.webSocket.send(`sub ${url}`);
}

/** Helper method to wait for the given amount of milliseconds. Helps to avoid constant pinging. */
function WaitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a WebSocket instance for the given URL and sets up the onMessage event to call the subscriber function.
 * @returns The created WebSocket instance.
 */
async function CreateWebSocket(
  resourceUrl: string
): Promise<WebSocketResource> {
  const webSocketUrl = await GetWebSocketUrl(resourceUrl);
  const webSocket = new WebSocket(webSocketUrl);

  const webSocketResource: WebSocketResource = {
    webSocket: webSocket,
    subscribers: new Set(),
  };

  webSocket.onmessage = (data) =>
    ProcessMessage(resourceUrl, data, webSocketResource.subscribers);

  return webSocketResource;
}

/**
 * Retrieves the WebSocket URL for the given Solid resource.
 * Throws an error if the resource doesn't have one (should never be the case).
 * @returns The WebSocket URL.
 */
async function GetWebSocketUrl(resourceUrl: string): Promise<string> {
  const session = GetSession();
  const response = await session.fetch(resourceUrl);
  const webSocketUrl = response.headers.get("Updates-Via");
  if (!webSocketUrl) throw new Error(`No WebSocket found for ${resourceUrl}`);
  return webSocketUrl;
}

/**
 * Processes an update message from the WebSocket and calls the subscriber function to react to it.
 * Ignores all other types of messages.
 */
function ProcessMessage(
  hostUrl: string,
  { data }: { data: string },
  subscribers: Set<Subscriber>
): void {
  if (oneTimeIgnoreSockets.has(hostUrl)) {
    console.log(
      `Socket update for [${hostUrl}] ignored once. Removing from ignore list...`
    );
    oneTimeIgnoreSockets.delete(hostUrl);
    return;
  }

  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match) return;

  const url = match[1];

  // Notify the subscribers
  subscribers.forEach((subscriber) => {
    subscriber.onReceive(url);
  });
}
