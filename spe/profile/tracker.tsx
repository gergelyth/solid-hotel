import { GetSession } from "../../common/util/solid";

//TODO maybe turn of ALL revalidations for certain useSWR keys, e.g. guest
// manually call refetch when we get a notifications that there is a change
// use compare(a,b) function to compare the fields we care about

//or get rid of SWR completely and fetch using the Solid functions - if we turn off revalidation we lose its purpose either way

const webSockets = [];

async function subscribe(url: string): Promise<void> {
  // Create a new subscription to the resource if none existed
  //   url = url.replace(/#.*/, "");
  await trackResource(url);
}

/** Tracks updates to the given resource */
async function trackResource(url: string): Promise<void> {
  // Obtain a WebSocket for the given host
  const { host } = new URL(url);
  if (!(host in webSockets)) {
    webSockets[host] = Promise.resolve(null).then(() =>
      createWebSocket(url, { host })
    );
  }
  const webSocket = await webSockets[host];

  // Track subscribed resources to resubscribe later if needed
  webSocket.resources.add(url);
  // Subscribe to updates on the resource
  while (webSocket.readyState !== WebSocket.OPEN) {
    console.log("closed");
    await delay(100);
  }
  webSocket.send(`sub ${url}`);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Creates a WebSocket for the given URL. */
async function createWebSocket(resourceUrl, options) {
  const webSocketUrl = await getWebSocketUrl(resourceUrl);
  const webSocket = new WebSocket(webSocketUrl);
  return Object.assign(
    webSocket,
    {
      resources: new Set(),
      reconnectionAttempts: 0,
      reconnectionDelay: 1000,
      onmessage: processMessage,
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
}

/** Retrieves the WebSocket URL for the given resource. */
async function getWebSocketUrl(resourceUrl) {
  const session = GetSession();
  const response = await session.fetch(resourceUrl);
  const webSocketUrl = response.headers.get("Updates-Via");
  if (!webSocketUrl) throw new Error(`No WebSocket found for ${resourceUrl}`);
  return webSocketUrl;
}

/** Processes an update message from the WebSocket */
function processMessage({ data }) {
  // Verify the message is an update notification
  const match = /^pub +(.+)/.exec(data);
  if (!match) return;

  // Invalidate the cache for the resource
  //   const url = match[1];
  //   ldflex.clearCache(url);

  // Notify the subscribers
  console.log("message received");
  console.log(data);
}

export default subscribe;
