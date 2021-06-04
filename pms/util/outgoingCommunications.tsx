import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { ReservationState } from "../../common/types/ReservationState";

export function ConfirmBookingRequest(replyInbox: string): void {
  SerializeReservationStateChange(replyInbox, ReservationState.CONFIRMED);
}
