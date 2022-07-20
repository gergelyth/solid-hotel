import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solidReservations";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { CreateDataProtectionProfile } from "../../../common/util/hotelProfileHandler";
import {
  CreateDataProtectionProfilePrivacyToken,
  FindHotelProfileTokenAndDeleteIt,
  FindInboxTokenAndDeleteIt,
} from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import {
  GetCurrentDatePushedBy,
  GetStartOfNextDay,
  ShowError,
} from "../../../common/util/helpers";
import { useGuest } from "../../../common/hooks/useGuest";
import { Field } from "../../../common/types/Field";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import { DeleteFromCache } from "../../../common/util/tracker/profileCache";
import { UnSubscribe } from "../../../common/util/tracker/tracker";
import { CreateReservationUrlFromReservationId } from "../../../common/util/urlParser";
import {
  RevalidateHotelPrivacyTokens,
  useHotelPrivacyTokens,
} from "../../../common/hooks/usePrivacyTokens";
import { PrivacyTokensUrl } from "../../../common/consts/solidIdentifiers";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";
import { SafeDeleteDataset } from "../../../common/util/solidWrapper";

/**
 * Creates the data protection profile of the guest according to the conditions retrieved from the mock API.
 * Removes the profile fields from the in-memory cache, deletes the hotel profile and closes the WebSocket to not receive publish messages anymore.
 * Removes the references to now not-needed fields as well as the corresponding privacy tokens.
 * Creates the new privacy tokens required by the new reservation state.
 */
async function ExecuteCheckOut(
  guestFields: Field[],
  dataProtectionInformation: DataProtectionInformation,
  reservationId: string,
  reservationOwner: string,
  replyInbox: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  const dataProtectionProfileWebId = await CreateDataProtectionProfile(
    guestFields
  );

  await SetReservationOwnerToHotelProfile(
    reservationId,
    dataProtectionProfileWebId
  );

  //TODO should we unsubscribe? that would mean we don't notify the guest if there's a change here
  UnSubscribe(reservationOwner);
  DeleteFromCache(reservationOwner);

  await SafeDeleteDataset(reservationOwner.split("#")[0]);
  await FindHotelProfileTokenAndDeleteIt(privacyTokens, reservationId);

  const privacyToken = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    CreateReservationUrlFromReservationId(reservationId),
    dataProtectionInformation.dataProtectionFields,
    GetStartOfNextDay(
      GetCurrentDatePushedBy(
        dataProtectionInformation.dataProtectionStorageDuration.years,
        dataProtectionInformation.dataProtectionStorageDuration.months,
        dataProtectionInformation.dataProtectionStorageDuration.days
      )
    )
  );

  await SendPrivacyToken(replyInbox, privacyToken);

  await FindInboxTokenAndDeleteIt(privacyTokens, reservationId, true);
  RevalidateHotelPrivacyTokens();
}

/**
 * A snackbar notification displayed in the bottom right corner executing the check-out operation for the reservation given by its ID.
 * We first retrieve the data protection information properties from the mock API to know what conditions to apply for the data protection profile.
 * Then we retrieve the values for these fields from the hotel profile of the guest in the hotel Pod create the data protection profile of the guest from these fields.
 * We also need to remove the now redundant privacy tokens and create new ones appropriate for the new reservation state.
 * @returns A custom progress snackbar executing the check-out operation.
 */
export const CheckoutProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarKey: string | number;
    reservationId: string;
    reservationOwner: string;
    replyInbox: string;
  }
>((props, ref) => {
  const { data: dataProtection, isError: apiError } =
    useDataProtectionInformation(undefined, props.reservationOwner);
  const { guestFields, isError: guestError } = useGuest(
    dataProtection?.dataProtectionFields,
    props.reservationOwner
  );
  const { items: privacyTokens, isError: tokenError } =
    useHotelPrivacyTokens(PrivacyTokensUrl);

  useEffect(() => {
    if (apiError || guestError || tokenError) {
      CloseSnackbar(props.snackbarKey);
      ShowError(
        `Failed to retrieve data protection information from the mock API, privacy tokens, or user information from ${props.reservationOwner}`,
        true
      );
      return;
    }

    if (!guestFields) {
      return;
    }
    if (!privacyTokens) {
      return;
    }
    if (!dataProtection) {
      throw new Error(
        "Data protection fields is undefined during check-out even though guest fields is not. This shouldn't happen."
      );
    }

    ExecuteCheckOut(
      guestFields,
      dataProtection,
      props.reservationId,
      props.reservationOwner,
      props.replyInbox,
      privacyTokens
    ).then(() => CloseSnackbar(props.snackbarKey));
  }, [guestFields, privacyTokens, apiError, guestError, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarKey}
      message={"Checking out guest"}
    />
  );
});

CheckoutProgressSnackbar.displayName = "CheckoutProgressSnackbar";
