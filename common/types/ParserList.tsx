import { NotificationParser } from "./NotificationParser";
import { NotificationType } from "./NotificationsType";

export type ParserList = Partial<Record<NotificationType, NotificationParser>>;
