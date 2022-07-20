import SOLIDHOTEL from "../../solidhotel-vocab/SOLIDHOTEL.js";
import { NotificationType } from "../../types/NotificationsType";
import { ReverseRecord } from "../../util/helpers";

/** A vocabulary map defining the RDF properties used for the notification enum type. */
export const NotificationTypeRdfMap: Record<NotificationType, string> = {
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

/** A vocabulary map defining a reverse mapping so we can look up RDF properties and map them to the notification enum type. */
export const ReverseNotificationTypeRdfMap = ReverseRecord(
  NotificationTypeRdfMap
);
