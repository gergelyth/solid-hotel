import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solid_reservations";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { useGuest } from "../../../common/hooks/useGuest";
import { CreateHotelProfile } from "../../../common/util/hotelProfileHandler";
import {
  HotelProfilesUrl,
  PrivacyTokensUrl,
} from "../../../common/consts/solidIdentifiers";
import { getDatetime } from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../../../common/vocabularies/rdf_reservation";
import {
  CreateActiveProfilePrivacyToken,
  FindWebIdTokenAndDeleteIt,
} from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { Field } from "../../../common/types/Field";
import { SubscribeToProfileChanges } from "../../util/trackerInitializer";
import { CacheProfileFields } from "../../../common/util/tracker/profileCache";
import { CreateReservationUrlFromReservationId } from "../../../common/util/urlParser";
import {
  RevalidateHotelPrivacyTokens,
  useHotelPrivacyTokens,
} from "../../../common/hooks/usePrivacyTokens";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";
import { GetStartOfNextDay, ShowError } from "../../../common/util/helpers";

async function ExecuteCheckIn(
  reservationId: string,
  guestFields: Field[],
  requiredFields: string[],
  replyInbox: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  console.log("execute check-in started");
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
  await FindWebIdTokenAndDeleteIt(privacyTokens, reservationId, false);
  RevalidateHotelPrivacyTokens();

  const checkoutDate = getDatetime(
    reservationThing,
    reservationFieldToRdfMap.checkoutTime
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
  console.log("privacy token sent");
}

const CheckinProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
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
    console.log("effect started");
    if (apiError || guestError || tokenError) {
      CloseSnackbar(props.key);
      ShowError(
        "Error using the hooks during check-in (potentially failed to retrieve fields from user's Pod)",
        true
      );
      return;
    }

    if (!guestFields) {
      console.log("guest fields null");
      return;
    }

    if (!privacyTokens) {
      console.log("privacy tokens undefined");
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
    ).then(() => CloseSnackbar(props.key));
  }, [guestFields, privacyTokens, apiError, guestError, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Checking in guest"}
    />
  );
});

CheckinProgressSnackbar.displayName = "CheckinProgressSnackbar";

export default CheckinProgressSnackbar;
