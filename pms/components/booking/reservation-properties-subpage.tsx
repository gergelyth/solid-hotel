import { Dispatch, SetStateAction } from "react";
import { ReservationState } from "../../../common/types/ReservationState";
import { GetSession } from "../../../common/util/solid";
import { BookingPage } from "../../pages/booking";
import {
  HotelWebId,
  RoomDefinitionsUrl,
} from "../../../common/consts/solidIdentifiers";
import { AddReservation } from "../../../common/util/solid_reservations";
import { ReservationAtHotel } from "../../../common/types/ReservationAtHotel";
import BookingProperties from "../../../common/components/booking/reservation-properties";
import {
  ShowInfoSnackbar,
  ShowSuccessSnackbar,
} from "../../../common/components/snackbar";
import { GetCoreReservationFolderFromInboxUrl } from "../../../common/util/urlParser";
import { CreateAndSavePairingToken } from "../../../common/util/pairingTokenHandler";

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

  const reservation: ReservationAtHotel = {
    id: null,
    inbox: null,
    //TODO perhaps this should be null?
    owner: HotelWebId,
    hotel: HotelWebId,
    room: room,
    state: ReservationState.CONFIRMED,
    dateFrom: checkinDate,
    dateTo: checkoutDate,
  };

  const reservationInboxUrl = await AddReservation(reservation, session);
  const reservationFolder =
    GetCoreReservationFolderFromInboxUrl(reservationInboxUrl);
  await CreateAndSavePairingToken(reservationFolder);
}

function ReservationPropertiesPage({
  currentPage,
  setCurrentPage,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
}): JSX.Element | null {
  //TODO if there is an error in log then call useRooms() always here, but add a parameter condition in it to return null if false
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

export default ReservationPropertiesPage;
