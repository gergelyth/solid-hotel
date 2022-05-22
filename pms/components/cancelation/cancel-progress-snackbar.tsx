import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { PrivacyTokensUrl } from "../../../common/consts/solidIdentifiers";
import {
  FindInboxTokenAndDeleteIt,
  FindWebIdTokenAndDeleteIt,
} from "../../util/privacyHelper";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { useHotelPrivacyTokens } from "../../../common/hooks/usePrivacyTokens";
import { HotelPrivacyToken } from "../../../common/types/HotelPrivacyToken";
import { ShowError } from "../../../common/util/helpers";

async function ExecuteCancel(
  reservationId: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  console.log("execute cancel started");

  //Deleting the mention of WebId and deleting the corresponding privacy token
  await FindWebIdTokenAndDeleteIt(privacyTokens, reservationId, true);
  await FindInboxTokenAndDeleteIt(privacyTokens, reservationId, true);
}

const CancelProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    reservationId: string;
  }
>((props, ref) => {
  const { items: privacyTokens, isError: tokenError } =
    useHotelPrivacyTokens(PrivacyTokensUrl);

  useEffect(() => {
    console.log("effect started");
    if (tokenError) {
      CloseSnackbar(props.key);
      ShowError("Error using the token hook during cancellation", true);
      return;
    }

    if (!privacyTokens) {
      console.log("privacy tokens undefined");
      return;
    }

    ExecuteCancel(props.reservationId, privacyTokens).then(() =>
      CloseSnackbar(props.key)
    );
  }, [privacyTokens, tokenError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Canceling reservation"}
    />
  );
});

CancelProgressSnackbar.displayName = "CancelProgressSnackbar";

export default CancelProgressSnackbar;
