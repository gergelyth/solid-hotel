export type Notification = {
  notificationUrl: string;
  isProcessed: boolean;
  text: string;
  createdAt: Date;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
