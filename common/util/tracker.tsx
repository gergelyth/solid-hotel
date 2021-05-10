import { GetSession } from "./solid";

//TODO maybe turn of ALL revalidations for certain useSWR keys, e.g. guest
// manually call refetch when we get a notifications that there is a change
// use compare(a,b) function to compare the fields we care about

//or get rid of SWR completely and fetch using the Solid functions - if we turn off revalidation we lose its purpose either way

const webSockets: { [host: string]: WebSocket } = {};

export async function Subscribe(
  url: string,
  onMessage: (datasetUrl: string) => void
): Promise<void> {
  // Create a new subscription to the resource if none existed
  //   url = url.replace(/#.*/, "");
  await trackResource(url, onMessage);
}

export async function UnSubscribe(url: string): Promise<void> {
  console.log(`Unsubscribe from ${url}`);
}

/** Tracks updates to the given resource */
async function trackResource(
  url: string,
  onMessage: (datasetUrl: string) => void
): Promise<void> {
  // Obtain a WebSocket for the given host
  const { host } = new URL(url);
  if (!(host in webSockets)) {
    webSockets[host] = await createWebSocket(url, { host });
  }

  const webSocket = webSockets[host];
  //TODO we need resources, otherwise we would overwrite the onMessage with every new subscribe
  webSocket.onmessage = (data) => processMessage(data, onMessage);

  // Track subscribed resources to resubscribe later if needed
  //TODO we need wrapper for WebSocket to track the resources
  // webSocket.resources.add(url);
  // Subscribe to updates on the resource
  while (webSocket.readyState !== WebSocket.OPEN) {
    console.log("closed");
    await WaitFor(100);
  }

  webSocket.send(`sub ${url}`);
}

function WaitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Creates a WebSocket for the given URL. */
async function createWebSocket(
  resourceUrl: string,
  options: { host: string }
): Promise<WebSocket> {
  const webSocketUrl = await getWebSocketUrl(resourceUrl);
  const webSocket = new WebSocket(webSocketUrl);

  Object.assign(
    webSocket,
    {
      resources: new Set(),
      ready: new Promise<void>((resolve) => {
        webSocket.onopen = () => {
          //   webSocket.reconnectionAttempts = 0;
          //   webSocket.reconnectionDelay = 1000;
          resolve();
        };
      }),
    },
    options
  );

  return webSocket;
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
  onMessage: (datasetUrl: string) => void
): void {
  console.log("Message received");
  console.log(data);
  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match) return;

  // Invalidate the cache for the resource
  //   const url = match[1];
  //   ldflex.clearCache(url);

  // Notify the subscribers
  console.log("Calling method");
  console.log(data);
  onMessage(data);
}
