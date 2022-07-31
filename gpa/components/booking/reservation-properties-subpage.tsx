import { Dispatch, SetStateAction } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import { GetSession } from "../../../common/util/solid";
import { BookingPage } from "../../pages/booking";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { SubmitBookingRequest } from "../../util/outgoingCommunications";
import { AddReservation } from "../../../common/util/solidReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { BookingProperties } from "../../../common/components/booking/reservation-properties";
import { IsNationalitySet } from "../../../common/util/solidProfile";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";

/**
 * The function to execute if the user decides to make the reservation.
 * It collects the properties selected for the reservation, such as the room and the check-in and check-out dates.
 * Creates the reservation in the guest Pod and submits the booking request to the hotel Pod.
 */
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

  const inboxUrl = await AddReservation(reservation, reservation.hotel);

  await SubmitBookingRequest({
    ...reservation,
    inbox: inboxUrl,
  });
}

/**
 * The GPA wrapper around the room selection component described in {@link BookingProperties}.
 * Defines the action to take when the user decides to go ahead with the reservation.
 * Doesn't call the function yet, but sets defines the function with the booking properties selected here.
 * @returns A component wrapping the {@link BookingProperties} component with GPA specific actions.
 */
export function ReservationPropertiesPage({
  currentPage,
  setCurrentPage,
  setConfirmReservation,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
  setConfirmReservation: Dispatch<SetStateAction<() => () => void>>;
}): JSX.Element | null {
  if (currentPage !== BookingPage.ReservationProperties) {
    return null;
  }

  return (
    <BookingProperties
      onSelectAction={async (roomId, checkinDate, checkoutDate) => {
        const isNationalitySet = await IsNationalitySet();
        if (!isNationalitySet) {
          ShowErrorSnackbar(
            "Nationality is not defined in the Solid Pod. Please set it through Profile Editor."
          );
          return;
        }
        setConfirmReservation(() => () => {
          BookRoom(roomId, checkinDate, checkoutDate);
        });
        setCurrentPage(currentPage + 1);
      }}
    />
  );
}
