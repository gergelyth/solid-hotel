import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solid_reservations";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { CreateDataProtectionProfile } from "../../../common/util/hotelProfileHandler";
import { CreateDataProtectionProfilePrivacyToken } from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { GetCurrentDatePushedBy } from "../../../common/util/helpers";
import { useGuest } from "../../../common/hooks/useGuest";
import { Field } from "../../../common/types/Field";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import { deleteSolidDataset } from "@inrupt/solid-client";
import { GetSession } from "../../../common/util/solid";

async function ExecuteCheckOut(
  guestFields: Field[],
  dataProtectionInformation: DataProtectionInformation,
  reservationId: string,
  reservationOwner: string,
  replyInbox: string
): Promise<void> {
  console.log("execute check-out started");

  const dataProtectionProfileWebId = await CreateDataProtectionProfile(
    guestFields
  );

  //TODO are we allowed to do this? we probably won't need the guest WebId anymore
  await SetReservationOwnerToHotelProfile(
    reservationId,
    dataProtectionProfileWebId
  );

  const session = GetSession();
  await deleteSolidDataset(reservationOwner.split("#")[0], {
    fetch: session.fetch,
  });

  const privacyToken = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    reservationOwner,
    dataProtectionInformation.dataProtectionFields,
    GetCurrentDatePushedBy(dataProtectionInformation.dataProtectionYears, 0, 0)
  );

  await SendPrivacyToken(replyInbox, privacyToken);
  console.log("privacy token sent");

  //TODO I think delete inbox?
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

  useEffect(() => {
    console.log("effect started");
    if (apiError || guestError) {
      CloseSnackbar(props.key);
      throw new Error(
        `Failed to retrieve data protection information from the mock API or user information from ${props.reservationOwner}`
      );
    }

    if (!guestFields) {
      console.log("Guest field information null");
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
      props.replyInbox
    ).then(() => CloseSnackbar(props.key));
  }, [guestFields, apiError, guestError]);

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
