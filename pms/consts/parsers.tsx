import { ParserList } from "../../common/types/ParserList";
import { NotificationType } from "../../common/types/NotificationsType";
import {
  ReceiveBookingRequest,
  ReceiveReservationStateChange,
} from "../util/incomingCommunications";

export const PMSParsers: ParserList = {
  [NotificationType.BookingRequest]: ReceiveBookingRequest,
  [NotificationType.ReservationStateChange]: ReceiveReservationStateChange,
};
