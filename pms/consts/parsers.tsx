import { ParserList } from "../../common/types/ParserList";
import { NotificationType } from "../../common/types/NotificationsType";
import {
  ReceiveBookingRequest,
  ReceiveInitialPairingRequest,
  ReceivePrivacyTokenDeletionRequest,
  ReceiveProfileModification,
  ReceiveReservationStateChange,
} from "../util/incomingCommunications";

/**
 * A mapping from notification type to notification processing function.
 * Based on this, the appropriate method is called to create the text, onClick and onReceive properties of the notification.
 */
export const PMSParsers: ParserList = {
  [NotificationType.BookingRequest]: ReceiveBookingRequest,
  [NotificationType.ReservationStateChange]: ReceiveReservationStateChange,
  [NotificationType.ProfileModification]: ReceiveProfileModification,
  [NotificationType.InitialPairingRequest]: ReceiveInitialPairingRequest,
  [NotificationType.PrivacyTokenDeletion]: ReceivePrivacyTokenDeletionRequest,
};
