export type Notification = {
  notificationUrl: string;
  isProcessed: boolean;
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
