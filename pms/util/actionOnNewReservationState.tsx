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
import { useGuest } from "../../common/hooks/useGuest";
import {
  useDataProtectionInformation,
  useRequiredFields,
} from "../../common/hooks/useMockApi";
import {
  CreateDataProtectionProfile,
  CreateHotelProfile,
  MoveProfileToDataProtectionFolder,
} from "../../common/util/hotelProfileHandler";
import { HotelProfilesUrl } from "../../common/consts/solidIdentifiers";
import {
  CreateActiveProfilePrivacyToken,
  CreateDataProtectionProfilePrivacyToken,
} from "./privacyHelper";
import { getDatetime } from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";
import { GetCurrentDatePushedBy } from "../../common/util/helpers";
import { CreateInboxUrlFromReservationId } from "../../common/util/urlParser";

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

async function OnCheckIn(
  reservationId: string,
  replyInbox: string
): Promise<void> {
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
  while (isLoading || !requiredFields.data) {
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
  const reservationThing = await SetReservationOwnerToHotelProfile(
    reservationId,
    hotelProfileWebId
  );

  const checkoutDate = getDatetime(
    reservationThing,
    reservationFieldToRdfMap.checkoutTime
  );
  if (!checkoutDate) {
    throw new Error("Checkout date is null in reservation");
  }

  const privacyTokenDataset = await CreateActiveProfilePrivacyToken(
    hotelProfileWebId,
    guestWebId,
    requiredFields.data,
    checkoutDate
  );
  SendPrivacyToken(replyInbox, privacyTokenDataset);
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

  const privacyTokenDataset = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    guestWebId,
    //TODO this doesn't work if it match - I think we should get rid of the matching parameter in the API file
    data.dataProtectionFields,
    GetCurrentDatePushedBy(data.dataProtectionYears, 0, 0)
  );
  SendPrivacyToken(replyInbox, privacyTokenDataset);
}
