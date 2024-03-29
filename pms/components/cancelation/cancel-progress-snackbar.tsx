import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { PrivacyTokensUrl } from "../../../common/consts/solidIdentifiers";
import {
  FindEmailTokenAndDeleteIt,
  FindInboxTokenAndDeleteIt,
  FindWebIdTokenAndDeleteIt,
} from "../../util/privacyHelper";
import { CloseSnackbar } from "../../../common/components/snackbar";
import {
  RevalidateHotelPrivacyTokens,
  useHotelPrivacyTokens,
} from "../../../common/hooks/usePrivacyTokens";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";
import { ShowError } from "../../../common/util/helpers";

/**
 * Finds and deletes the privacy tokens created for the confirmed reservation (webId, inbox URL).
 */
async function ExecuteCancel(
  reservationId: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  //Deleting the mention of WebId and deleting the corresponding privacy token
  await FindWebIdTokenAndDeleteIt(privacyTokens, reservationId, true);
  await FindEmailTokenAndDeleteIt(privacyTokens, reservationId);
  await FindInboxTokenAndDeleteIt(privacyTokens, reservationId, true);

  // RevalidateHotelPrivacyTokens();
}

/**
 * A snackbar notification displayed in the bottom right corner performing the reservation cancel operation for the reservation given by its ID.
 * Fetches the hotel privacy tokens and deletes those which were created for this reservation.
 * The reservation state change is not done here but in the calling method.
 * @returns A custom progress snackbar executing the cancel operation.
 */
export const CancelProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarKey: string | number;
    reservationId: string;
  }
>((props, ref) => {
  const { items: privacyTokens, isError: tokenError } =
    useHotelPrivacyTokens(PrivacyTokensUrl);

  useEffect(() => {
    if (tokenError) {
      CloseSnackbar(props.snackbarKey);
      ShowError("Error using the token hook during cancellation", true);
      return;
    }

    if (!privacyTokens) {
      return;
    }

    ExecuteCancel(props.reservationId, privacyTokens).then(() =>
      CloseSnackbar(props.snackbarKey)
    );
  }, [privacyTokens, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarKey}
      message={"Canceling reservation"}
    />
  );
});

CancelProgressSnackbar.displayName = "CancelProgressSnackbar";
