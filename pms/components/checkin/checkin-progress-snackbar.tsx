import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solidReservations";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { useGuest } from "../../../common/hooks/useGuest";
import { CreateHotelProfile } from "../../../common/util/hotelProfileHandler";
import {
  HotelProfilesUrl,
  PrivacyTokensUrl,
} from "../../../common/consts/solidIdentifiers";
import { getDatetime } from "@inrupt/solid-client";
import { ReservationFieldToRdfMap } from "../../../common/vocabularies/rdfReservation";
import {
  CreateActiveProfilePrivacyToken,
  FindEmailTokenAndDeleteIt,
} from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { Field } from "../../../common/types/Field";
import { SubscribeToProfileChanges } from "../util/tracker-initializer";
import { CacheProfileFields } from "../../../common/util/tracker/profileCache";
import { CreateReservationUrlFromReservationId } from "../../../common/util/urlParser";
import {
  RevalidateHotelPrivacyTokens,
  useHotelPrivacyTokens,
} from "../../../common/hooks/usePrivacyTokens";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";
import { GetStartOfNextDay, ShowError } from "../../../common/util/helpers";

/**
 * Creates the hotel profile of the guest, caches the field values in memory and subscribes to WebSocket messages monitoring for changes in the values of the fields.
 * Removes the references to now not-needed fields as well as the corresponding privacy tokens.
 * Creates the new privacy tokens required by the new reservation state.
 */
async function ExecuteCheckIn(
  reservationId: string,
  guestFields: Field[],
  requiredFields: string[],
  replyInbox: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  const hotelProfileWebId = await CreateHotelProfile(
    guestFields,
    HotelProfilesUrl
  );

  await CacheProfileFields(hotelProfileWebId, guestFields);
  await SubscribeToProfileChanges(hotelProfileWebId, requiredFields);

  //Deleting the mention of WebId and deleting the corresponding privacy token
  const reservationThing = await SetReservationOwnerToHotelProfile(
    reservationId,
    hotelProfileWebId
  );
  await FindEmailTokenAndDeleteIt(privacyTokens, reservationId);
  RevalidateHotelPrivacyTokens();

  const checkoutDate = getDatetime(
    reservationThing,
    ReservationFieldToRdfMap.checkoutTime
  );
  if (!checkoutDate) {
    throw new Error("Checkout date is null in reservation");
  }

  const privacyToken = await CreateActiveProfilePrivacyToken(
    hotelProfileWebId,
    replyInbox,
    CreateReservationUrlFromReservationId(reservationId),
    requiredFields,
    GetStartOfNextDay(checkoutDate)
  );

  await SendPrivacyToken(replyInbox, privacyToken);
}

/**
 * A snackbar notification displayed in the bottom right corner executing the check-in operation for the reservation given by its ID.
 * We first retrieve the required fields from the mock API to know what personal information we require.
 * Then we retrieve the values for these fields from the Pod of the guest and create the hotel profile of the guest from these fields.
 * We also need to remove the now redundant privacy tokens and create new ones appropriate for the new reservation state.
 * @returns A custom progress snackbar executing the check-in operation.
 */
export const CheckinProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarKey: string | number;
    reservationId: string;
    guestWebId: string;
    replyInbox: string;
  }
>((props, ref) => {
  const { data: requiredFields, isError: apiError } = useRequiredFields(
    undefined,
    props.guestWebId
  );
  const { guestFields, isError: guestError } = useGuest(
    requiredFields,
    props.guestWebId
  );
  const { items: privacyTokens, isError: tokenError } =
    useHotelPrivacyTokens(PrivacyTokensUrl);

  useEffect(() => {
    if (apiError || guestError || tokenError) {
      CloseSnackbar(props.snackbarKey);
      ShowError(
        "Error using the hooks during check-in (potentially failed to retrieve fields from user's Pod)",
        true
      );
      return;
    }

    if (!guestFields || !privacyTokens) {
      return;
    }

    if (!requiredFields) {
      throw new Error(
        "Required fields is undefined during check-in even though guest fields is not. This shouldn't happen."
      );
    }

    ExecuteCheckIn(
      props.reservationId,
      guestFields,
      requiredFields,
      props.replyInbox,
      privacyTokens
    ).then(() => CloseSnackbar(props.snackbarKey));
  }, [guestFields, privacyTokens, apiError, guestError, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarKey}
      message={"Checking in guest"}
    />
  );
});

CheckinProgressSnackbar.displayName = "CheckinProgressSnackbar";
