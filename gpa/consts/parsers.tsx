import { ParserList } from "../../common/types/ParserList";
import { NotificationType } from "../../common/types/NotificationsType";
import {
  ReceiveFailureReport,
  ReceivePairingRequestWithInformation,
  ReceivePrivacyToken,
  ReceivePrivacyTokenDeletionNotice,
  ReceiveProfileModification,
  ReceiveReservationStateChange,
} from "../util/incomingCommunications";

/** A mapping from notification type to notification processing function.
 * Based on this, the appropriate method is called to create the text, onClick and onReceive properties of the notification.
 */
export const GPAParsers: ParserList = {
  [NotificationType.ReservationStateChange]: ReceiveReservationStateChange,
  [NotificationType.FailureReport]: ReceiveFailureReport,
  [NotificationType.PairingRequestWithInformation]:
    ReceivePairingRequestWithInformation,
  [NotificationType.PrivacyToken]: ReceivePrivacyToken,
  [NotificationType.PrivacyTokenDeletion]: ReceivePrivacyTokenDeletionNotice,
  [NotificationType.ProfileModification]: ReceiveProfileModification,
};
