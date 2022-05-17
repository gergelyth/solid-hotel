import { NotificationType } from "./NotificationsType";

export type Notification = {
  notificationUrl: string;
  isProcessed: boolean;
  type: NotificationType;
  text: string;
  createdAt: Date;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
