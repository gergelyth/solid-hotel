import { Dispatch, SetStateAction } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import { GetSession } from "../../../common/util/solid";
import { BookingPage } from "../../pages/booking";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { SubmitBookingRequest } from "../../util/outgoingCommunications";
import { AddReservation } from "../../../common/util/solid_reservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import BookingProperties from "../../../common/components/booking/reservation-properties";

async function BookRoom(
  roomIdString: string | undefined,
  checkinDate: Date | undefined,
  checkoutDate: Date | undefined
): Promise<void> {
  if (!roomIdString || !checkinDate || !checkoutDate) {
    return;
  }

  const room = RoomDefinitionsUrl + roomIdString;
  const session = GetSession();

  const webId = session.info.webId;
  if (!webId) {
    return;
  }

  const reservation: ReservationAtHotel = {
    id: null,
    inbox: null,
    owner: webId,
    hotel: HotelWebId,
    room: room,
    state: ReservationState.REQUESTED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  const inboxUrl = AddReservation(reservation, session);
  reservation.inbox = await inboxUrl;

  SubmitBookingRequest(reservation, session);
}

function ReservationPropertiesPage({
  currentPage,
  setCurrentPage,
  setConfirmReservation,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
  setConfirmReservation: Dispatch<SetStateAction<() => () => void>>;
}): JSX.Element | null {
  //TODO if there is an error in log then call useRooms() always here, but add a parameter condition in it to return null if false
  if (currentPage !== BookingPage.ReservationProperties) {
    return null;
  }

  return (
    <BookingProperties
      onSelectAction={(roomId, checkinDate, checkoutDate) => {
        setConfirmReservation(() => () => {
          BookRoom(roomId, checkinDate, checkoutDate);
        });
        setCurrentPage(currentPage + 1);
      }}
    />
  );
}

export default ReservationPropertiesPage;
