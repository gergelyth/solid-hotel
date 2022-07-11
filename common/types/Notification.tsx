import { NotificationType } from "./NotificationsType";

/** A notification object encompassing information about the object itself and the functions to perform in certain circumstances. */
export type Notification = {
  notificationUrl: string;
  isProcessed: boolean;
  type: NotificationType;
  text: string;
  createdAt: Date;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
