import {
  CloseSnackbar,
  ShowWarningSnackbar,
} from "../../common/components/snackbar";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import CustomProgressSnackbar from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { useGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { deleteSolidDataset } from "@inrupt/solid-client";

const PrivacyTokenRemover = forwardRef<
  HTMLDivElement,
  {
    snackbarId: string | number;
    hotelUrl: string;
  }
>((props, ref) => {
  const { items: privacyTokens, isError: privacyTokensError } =
    useGuestPrivacyTokens(GetUserPrivacyPodUrl());

  useEffect(() => {
    console.log("Privacy token removal effect started");
    if (privacyTokensError) {
      CloseSnackbar(props.snackbarId);
      throw new Error(
        `Error using the privacy tokens hook [${privacyTokensError}] during privacy token removal.`
      );
    }

    if (!privacyTokens) {
      console.log("privacy tokens null");
      return;
    }

    const privacyToken = privacyTokens.find(
      (t) => t && t.urlAtHotel === props.hotelUrl
    );
    if (!privacyToken) {
      ShowWarningSnackbar(
        "Sought privacy token for removal not found. Deleting nothing."
      );
      CloseSnackbar(props.snackbarId);
      return;
    }

    if (!privacyToken.urlAtGuest) {
      throw new Error(
        "GuestPrivacyToken URL is null during token removal process."
      );
    }

    const session = GetSession();
    deleteSolidDataset(privacyToken.urlAtGuest, { fetch: session.fetch }).then(
      () => CloseSnackbar(props.snackbarId)
    );
  }, [privacyTokens, privacyTokensError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.snackbarId}
      message={"Removing privacy token..."}
    />
  );
});

PrivacyTokenRemover.displayName = "PrivacyTokenRemover";

export default PrivacyTokenRemover;
