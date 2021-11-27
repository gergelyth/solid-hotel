import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import {
  GetWebIdFromReservation,
  SetReservationOwnerToHotelProfile,
} from "../../../common/util/solid_reservations";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { CreateDataProtectionProfile } from "../../../common/util/hotelProfileHandler";
import { CreateDataProtectionProfilePrivacyToken } from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import { GetCurrentDatePushedBy } from "../../../common/util/helpers";

async function ExecuteCheckOut(
  dataProtectionInformation: DataProtectionInformation,
  reservationId: string,
  replyInbox: string
): Promise<void> {
  console.log("execute check-out started");

  const guestWebId = await GetWebIdFromReservation(reservationId);
  if (!guestWebId) {
    //TODO solve for offline checkin
    throw new Error(`Guest webID null in reservation ${reservationId}`);
  }

  const dataProtectionProfileWebId = await CreateDataProtectionProfile(
    dataProtectionInformation.dataProtectionFields,
    guestWebId
  );

  //TODO are we allowed to do this? we probably won't need the guest WebId anymore
  SetReservationOwnerToHotelProfile(reservationId, dataProtectionProfileWebId);

  const privacyToken = await CreateDataProtectionProfilePrivacyToken(
    dataProtectionProfileWebId,
    guestWebId,
    dataProtectionInformation.dataProtectionFields,
    GetCurrentDatePushedBy(dataProtectionInformation.dataProtectionYears, 0, 0)
  );

  SendPrivacyToken(replyInbox, privacyToken);
  console.log("privacy token sent");
}

const CheckoutProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    reservationId: string;
    replyInbox: string;
  }
>((props, ref) => {
  const { data, isError } = useDataProtectionInformation();

  useEffect(() => {
    console.log("effect started");
    if (isError) {
      CloseSnackbar(props.key);
      throw new Error(
        "Failed to retrieve data protection information from the mock API"
      );
    }

    if (!data) {
      console.log("Data protection information null");
      return;
    }

    ExecuteCheckOut(data, props.reservationId, props.replyInbox).then(() =>
      CloseSnackbar(props.key)
    );
  }, [data, isError]);

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
