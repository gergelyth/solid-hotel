import { NotificationParser } from "./NotificationParser";
import { NotificationType } from "./NotificationsType";

/** The type signature of the mapping between notification type and parser function. */
export type ParserList = Partial<Record<NotificationType, NotificationParser>>;
