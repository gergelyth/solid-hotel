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

async function ExecuteCancel(
  reservationId: string,
  privacyTokens: (HotelPrivacyToken | null)[]
): Promise<void> {
  console.log("execute cancel started");

  //TODO Deleting the mention of WebId and deleting the corresponding privacy token
  await FindWebIdTokenAndDeleteIt(privacyTokens, reservationId);
  await FindInboxTokenAndDeleteIt(privacyTokens, reservationId);
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
      throw new Error("Error using the token hook during cancel");
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
