export type WebSocketResource = {
  webSocket: WebSocket;
  subscribers: Set<Subscriber>;
};

export type Subscriber = {
  onReceive: (data: string) => void;
  onClick: (data: string) => void;
};
