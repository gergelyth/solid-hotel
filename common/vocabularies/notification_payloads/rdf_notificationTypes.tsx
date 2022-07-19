import SOLIDHOTEL from "../../solidhotel-vocab/SOLIDHOTEL.js";
import { NotificationType } from "../../types/NotificationsType.jsx";

/** A vocabulary map defining the RDF properties used for the notification enum type. */
export const notificationTypeRdfMap: Record<NotificationType, string> = {
  [NotificationType.BookingRequest]: SOLIDHOTEL.BookingRequestNotification,
  [NotificationType.ReservationStateChange]:
    SOLIDHOTEL.ReservationStateChangeNotification,
  [NotificationType.FailureReport]: SOLIDHOTEL.FailureReportNotification,
  [NotificationType.ProfileModification]:
    SOLIDHOTEL.ProfileModificationNotification,
  [NotificationType.InitialPairingRequest]:
    SOLIDHOTEL.InitialPairingRequestNotification,
  [NotificationType.PairingRequestWithInformation]:
    SOLIDHOTEL.PairingRequestWithInformationNotification,
  [NotificationType.PrivacyToken]: SOLIDHOTEL.PrivacyToken,
  [NotificationType.PrivacyTokenDeletion]: SOLIDHOTEL.PrivacyTokenDeletion,
};
