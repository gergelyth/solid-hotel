import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solid_reservations";
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
import { deleteSolidDataset } from "@inrupt/solid-client";
import { GetSession } from "../../../common/util/solid";
import { DeleteFromCache } from "../../../common/util/tracker/profileCache";
import { UnSubscribe } from "../../../common/util/tracker/tracker";
import { CreateReservationUrlFromReservationId } from "../../../common/util/urlParser";
import {
  RevalidateHotelPrivacyTokens,
  useHotelPrivacyTokens,
} from "../../../common/hooks/usePrivacyTokens";
import { PrivacyTokensUrl } from "../../../common/consts/solidIdentifiers";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";

async function ExecuteCheckOut(
  guestFields: Field[],
  dataProtectionInformation: DataProtectionInformation,
  reservationId: string,
  reservationOwner: string,
  replyInbox: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  console.log("execute check-out started");

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

  const session = GetSession();
  await deleteSolidDataset(reservationOwner.split("#")[0], {
    fetch: session.fetch,
  });
  await FindHotelProfileTokenAndDeleteIt(privacyTokens, reservationId);

  const privacyToken = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    CreateReservationUrlFromReservationId(reservationId),
    dataProtectionInformation.dataProtectionFields,
    GetStartOfNextDay(
      GetCurrentDatePushedBy(
        dataProtectionInformation.dataProtectionYears,
        0,
        0
      )
    )
  );

  await SendPrivacyToken(replyInbox, privacyToken);
  console.log("privacy token sent");

  await FindInboxTokenAndDeleteIt(privacyTokens, reservationId, true);
  RevalidateHotelPrivacyTokens();
}

const CheckoutProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
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
    console.log("effect started");
    if (apiError || guestError || tokenError) {
      CloseSnackbar(props.key);
      ShowError(
        `Failed to retrieve data protection information from the mock API, privacy tokens, or user information from ${props.reservationOwner}`,
        true
      );
      return;
    }

    if (!guestFields) {
      console.log("Guest field information null");
      return;
    }
    if (!privacyTokens) {
      console.log("privacy tokens undefined");
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
    ).then(() => CloseSnackbar(props.key));
  }, [guestFields, privacyTokens, apiError, guestError, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Checking out guest"}
    />
  );
});

CheckoutProgressSnackbar.displayName = "CheckoutProgressSnackbar";

export default CheckoutProgressSnackbar;
