/** A type encompassing the reaction functions in various circumstances of a WebSocket update. */
export type Subscriber = {
  onReceive: (url: string) => void;
};

/** A grouping type containing the WebSocket instance and its subscribers. */
export type WebSocketResource = {
  webSocket: WebSocket;
  subscribers: Set<Subscriber>;
};
