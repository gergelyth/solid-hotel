import { ReservationState } from "../../common/types/ReservationState";
import {
  GetWebIdFromReservation,
  SetReservationOwnerToHotelProfile,
  SetReservationStateAndInbox,
} from "../../common/util/solid_reservations";
import {
  ConfirmReservationStateRequest,
  ReportFailureToGuest,
  SendPrivacyToken,
} from "./outgoingCommunications";
import { useDataProtectionInformation } from "../../common/hooks/useMockApi";
import {
  CreateDataProtectionProfile,
  MoveProfileToDataProtectionFolder,
} from "../../common/util/hotelProfileHandler";
import { CreateDataProtectionProfilePrivacyToken } from "./privacyHelper";
import { GetCurrentDatePushedBy } from "../../common/util/helpers";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";
import { ShowCustomSnackbar } from "../../common/components/snackbar";
import CheckinProgressSnackbar from "../components/checkin/checkin-progress-snackbar";

export function DoOnStateChange(
  reservationId: string,
  newState: ReservationState,
  guestInboxUrl: string
): void {
  switch (newState) {
    case ReservationState.CANCELLED:
      //no special activity required for cancellation
      //TODO potentially delete the PI?
      break;

    case ReservationState.ACTIVE:
      try {
        OnCheckIn(reservationId, guestInboxUrl);
      } catch (error) {
        ReportFailureToGuest(
          error.message,
          ReservationState.CONFIRMED,
          guestInboxUrl
        );
        return;
      }

      break;

    case ReservationState.PAST:
      try {
        OnCheckOut(reservationId, guestInboxUrl);
      } catch (error) {
        ReportFailureToGuest(
          error.message,
          ReservationState.ACTIVE,
          guestInboxUrl
        );
        return;
      }
      break;

    default:
      throw new Error(
        `Reservation state change ${newState.toString()} doesn't make sense on hotel side`
      );
  }

  SetReservationStateAndInbox(reservationId, newState, guestInboxUrl);

  const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);
  ConfirmReservationStateRequest(newState, guestInboxUrl, hotelInboxUrl);
}

function OnCheckIn(reservationId: string, replyInbox: string): void {
  ShowCustomSnackbar((key) => (
    <CheckinProgressSnackbar
      key={key}
      reservationId={reservationId}
      replyInbox={replyInbox}
    />
  ));
}

async function OnCheckOut(
  reservationId: string,
  replyInbox: string
): Promise<void> {
  const guestWebId = await GetWebIdFromReservation(reservationId);
  if (!guestWebId) {
    //TODO solve for offline checkin
    throw new Error(`Guest webID null in reservation ${reservationId}`);
  }

  const { data, isLoading, isError } = useDataProtectionInformation();
  //TODO this is dirty, possibly a better solution?
  while (isLoading) {
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!data || isError) {
    throw new Error(
      "Failed to retrieve data protection information from mock API"
    );
  }

  let dataProtectionProfileWebId: string;
  if (data.dataProtectionFieldsMatch) {
    dataProtectionProfileWebId = await MoveProfileToDataProtectionFolder(
      guestWebId
    );
  } else {
    dataProtectionProfileWebId = await CreateDataProtectionProfile(
      data.dataProtectionFields,
      guestWebId
    );
  }

  //TODO are we allowed to do this? we probably won't need the guest WebId anymore
  SetReservationOwnerToHotelProfile(reservationId, dataProtectionProfileWebId);

  const privacyToken = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    guestWebId,
    //TODO this doesn't work if it match - I think we should get rid of the matching parameter in the API file
    data.dataProtectionFields,
    GetCurrentDatePushedBy(data.dataProtectionYears, 0, 0)
  );

  SendPrivacyToken(replyInbox, privacyToken);
}
