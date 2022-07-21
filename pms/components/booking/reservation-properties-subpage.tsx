import { Dispatch, SetStateAction } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import { BookingPage } from "../../pages/booking";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { AddReservation } from "../../../common/util/solidReservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import { BookingProperties } from "../../../common/components/booking/reservation-properties";
import {
  ShowInfoSnackbar,
  ShowSuccessSnackbar,
} from "../../../common/components/snackbar";
import { GetCoreReservationFolderFromInboxUrl } from "../../../common/util/urlParser";
import { CreateAndSavePairingToken } from "../../../common/util/pairingTokenHandler";
import { RevalidateReservations } from "../../../common/hooks/useReservations";

/**
 * The function to execute if the user decides to make the reservation.
 * It collects the properties selected for the reservation, such as the room and the check-in and check-out dates.
 * Creates the reservation in the hotel Pod, along with the reservation inbox and pairing token as well.
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

  const reservation: ReservationAtHotel = {
    id: null,
    inbox: null,
    owner: HotelWebId,
    hotel: HotelWebId,
    room: room,
    state: ReservationState.CONFIRMED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  const reservationInboxUrl = await AddReservation(reservation);
  const reservationFolder =
    GetCoreReservationFolderFromInboxUrl(reservationInboxUrl);
  await CreateAndSavePairingToken(reservationFolder);
  RevalidateReservations();
}

/**
 * The PMS wrapper around the room selection component described in {@link BookingProperties}.
 * Defines the action to take when the user decides to go ahead with the reservation.
 * Doesn't call the function yet, but sets defines the function with the booking properties selected here.
 * @returns A component wrapping the {@link BookingProperties} component with PMS specific actions.
 */
export function ReservationPropertiesPage({
  currentPage,
  setCurrentPage,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
}): JSX.Element | null {
  if (currentPage !== BookingPage.ReservationProperties) {
    return null;
  }

  return (
    <BookingProperties
      onSelectAction={async (roomId, checkinDate, checkoutDate) => {
        ShowInfoSnackbar("Saving reservation...");
        await BookRoom(roomId, checkinDate, checkoutDate);
        ShowSuccessSnackbar("Reservation saved!");
        setCurrentPage(currentPage + 1);
      }}
    />
  );
}
