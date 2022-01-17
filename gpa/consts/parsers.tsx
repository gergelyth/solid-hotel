import { ParserList } from "../../common/types/ParserList";
import { NotificationType } from "../../common/types/NotificationsType";
import {
  ReceiveFailureReport,
  ReceivePairingRequestWithInformation,
  ReceivePrivacyToken,
  ReceiveProfileModification,
  ReceiveReservationStateChange,
} from "../util/incomingCommunications";

export const GPAParsers: ParserList = {
  [NotificationType.ReservationStateChange]: ReceiveReservationStateChange,
  [NotificationType.FailureReport]: ReceiveFailureReport,
  [NotificationType.PairingRequestWithInformation]:
    ReceivePairingRequestWithInformation,
  [NotificationType.PrivacyToken]: ReceivePrivacyToken,
  [NotificationType.ProfileModification]: ReceiveProfileModification,
};
