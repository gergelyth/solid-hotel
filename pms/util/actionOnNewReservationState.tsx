import { ReservationState } from "../../common/types/ReservationState";
import {
  GetWebIdFromReservation,
  SetReservationOwnerToHotelProfile,
  SetReservationStateAndInbox,
} from "../../common/util/solid";
import { ConfirmReservationStateRequest } from "./outgoingCommunications";
import { useGuest } from "../../common/hooks/useGuest";
import {
  useDataProtectionInformation,
  useRequiredFields,
} from "../../common/hooks/useMockApi";
import {
  CreateDataProtectionProfile,
  CreateHotelProfile,
  MoveProfileToDataProtectionFolder,
} from "./hotelProfileHandler";
import { HotelProfilesUrl } from "../../common/consts/solidIdentifiers";

export function DoOnStateChange(
  reservationId: string,
  newState: ReservationState,
  guestInboxUrl: string,
  hotelInboxUrl: string
): void {
  switch (newState) {
    case ReservationState.CANCELLED:
      //no special activity required for cancellation
      //TODO potentially delete the PI?
      break;

    case ReservationState.ACTIVE:
      try {
        OnCheckIn(reservationId);
      } catch (error) {
        //TODO report failure to guest
        return;
      }

      break;

    case ReservationState.PAST:
      try {
        OnCheckOut(reservationId);
      } catch (error) {
        //TODO report failure to guest
        return;
      }
      break;

    default:
      throw new Error(
        `Reservation state change ${newState.toString()} doesn't make sense on hotel side`
      );
      break;
  }

  SetReservationStateAndInbox(reservationId, newState, guestInboxUrl);
  ConfirmReservationStateRequest(newState, guestInboxUrl, hotelInboxUrl);
}

async function OnCheckIn(reservationId: string): Promise<void> {
  const guestWebId = await GetWebIdFromReservation(reservationId);
  if (!guestWebId) {
    //TODO solve for offline checkin
    throw new Error(`Guest webID null in reservation ${reservationId}`);
  }

  const requiredFields = useRequiredFields();
  const { guestFields, isLoading, isError } = useGuest(
    requiredFields?.data,
    guestWebId
  );

  //TODO this is dirty, possibly a better solution?
  while (isLoading) {
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!guestFields || isError) {
    throw new Error("Failed to retrieve required elements from guest Pod");
  }

  const hotelProfileWebId = await CreateHotelProfile(
    guestFields,
    HotelProfilesUrl
  );
  //TODO are we allowed to do this? we probably won't need the guest WebId anymore
  SetReservationOwnerToHotelProfile(reservationId, hotelProfileWebId);
}

async function OnCheckOut(reservationId: string): Promise<void> {
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
  return;
}
