export type Notification = {
  notificationUrl: string;
  isProcessed: boolean;
  text: string;
  lastModTime: number;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
