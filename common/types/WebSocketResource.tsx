export type WebSocketResource = {
  webSocket: WebSocket;
  subscribers: Set<Subscriber>;
};

export type Subscriber = {
  onReceive: (url: string) => void;
  onClick: (data: string) => void;
};
