import { Subscriber, WebSocketResource } from "../../types/WebSocketResource";
import { GetSession } from "../solid";

const webSockets: { [host: string]: WebSocketResource } = {};

const oneTimeIgnoreSockets = new Set<string>();

export async function Subscribe(
  url: string,
  subscriber: Subscriber
): Promise<void> {
  // Create a new subscription to the resource if none existed
  //   url = url.replace(/#.*/, "");
  await TrackResource(url, subscriber);
}

export function UnSubscribe(url: string): void {
  //TODO does this work?
  const webSocketResource = webSockets[url];
  if (!webSocketResource) {
    console.log(
      `Websocket [${url}] not found in websocket list. Can't unsubscribe`
    );
    return;
  }

  webSocketResource.webSocket.close();
  delete webSockets[url];

  console.log(`Unsubscribed from ${url}`);
}

export function IgnoreNextUpdate(url: string): void {
  oneTimeIgnoreSockets.add(url);
}

/** Tracks updates to the given resource */
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
    console.log("closed");
    await WaitFor(100);
  }

  webSocketResource.webSocket.send(`sub ${url}`);
}

function WaitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Creates a WebSocket for the given URL. */
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

/** Retrieves the WebSocket URL for the given resource. */
async function GetWebSocketUrl(resourceUrl: string): Promise<string> {
  const session = GetSession();
  const response = await session.fetch(resourceUrl);
  const webSocketUrl = response.headers.get("Updates-Via");
  if (!webSocketUrl) throw new Error(`No WebSocket found for ${resourceUrl}`);
  return webSocketUrl;
}

/** Processes an update message from the WebSocket */
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

  console.log("Message received");
  console.log(data);
  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match) return;

  const url = match[1];
  // Invalidate the cache for the resource
  //   const url = match[1];
  //   ldflex.clearCache(url);

  // Notify the subscribers
  console.log("Calling method");
  console.log(data);
  subscribers.forEach((subscriber) => {
    subscriber.onReceive(url);
  });

  //TODO create notification
}
