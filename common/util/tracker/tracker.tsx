import { Subscriber, WebSocketResource } from "../../types/WebSocketResource";
import { GetSession } from "../solid";

//TODO maybe turn of ALL revalidations for certain useSWR keys, e.g. guest
// manually call refetch when we get a notifications that there is a change
// use compare(a,b) function to compare the fields we care about

//or get rid of SWR completely and fetch using the Solid functions - if we turn off revalidation we lose its purpose either way

const webSockets: { [host: string]: WebSocketResource } = {};

//TODO what happens to these subscribers if I close the app and come back to it? we need to persist this
export async function Subscribe(
  url: string,
  subscriber: Subscriber
): Promise<void> {
  // Create a new subscription to the resource if none existed
  //   url = url.replace(/#.*/, "");
  await trackResource(url, subscriber);
}

export async function UnSubscribe(url: string): Promise<void> {
  console.log(`Unsubscribe from ${url}`);
}

/** Tracks updates to the given resource */
async function trackResource(
  url: string,
  subscriber: Subscriber
): Promise<void> {
  // Obtain a WebSocket for the given host
  if (!(url in webSockets)) {
    webSockets[url] = await createWebSocket(url);
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
async function createWebSocket(
  resourceUrl: string
): Promise<WebSocketResource> {
  const webSocketUrl = await getWebSocketUrl(resourceUrl);
  const webSocket = new WebSocket(webSocketUrl);

  const webSocketResource: WebSocketResource = {
    webSocket: webSocket,
    subscribers: new Set(),
  };

  //TODO this probably wont work
  webSocket.onmessage = (data) =>
    processMessage(data, webSocketResource.subscribers);

  return webSocketResource;
}

/** Retrieves the WebSocket URL for the given resource. */
async function getWebSocketUrl(resourceUrl: string): Promise<string> {
  const session = GetSession();
  const response = await session.fetch(resourceUrl);
  const webSocketUrl = response.headers.get("Updates-Via");
  if (!webSocketUrl) throw new Error(`No WebSocket found for ${resourceUrl}`);
  return webSocketUrl;
}

/** Processes an update message from the WebSocket */
function processMessage(
  { data }: { data: string },
  subscribers: Set<Subscriber>
): void {
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
