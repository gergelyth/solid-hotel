import {
  CloseSnackbar,
  ShowWarningSnackbar,
} from "../../common/components/snackbar";
import { GetUserPrivacyPodUrl } from "../../common/util/solid";
import { CustomProgressSnackbar } from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import {
  RevalidateGuestPrivacyTokens,
  useGuestPrivacyTokens,
} from "../../common/hooks/usePrivacyTokens";
import { NotEmptyItem, ShowError } from "../../common/util/helpers";
import { SafeDeleteDataset } from "../../common/util/solid_wrapper";

/**
 * A snackbar notification displayed in the bottom right corner to inform the user that privacy tokens are being deleted.
 * This is triggered in reaction to the hotel's notice that a privacy token was deleted on their side and we should delete the corresponding one on the side of the guest as well.
 * Deletes all privacy tokens which reference the hotel privacy token that was just deleted.
 * @returns A custom progress snackbar deleting the corresponding guest privacy tokens to the hotel's recently deleted token.
 */
export const PrivacyTokenRemover = forwardRef<
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
      ShowError(
        `Error using the privacy tokens hook [${privacyTokensError}] during privacy token removal.`,
        false
      );
      return;
    }

    if (!privacyTokens) {
      console.log("privacy tokens null");
      return;
    }

    const filteredPrivacyTokens = privacyTokens
      .filter(NotEmptyItem)
      .filter((t) => t.urlAtHotel === props.hotelUrl);
    if (filteredPrivacyTokens.length == 0) {
      ShowWarningSnackbar(
        "Sought privacy token(s) for removal not found. Deleting nothing."
      );
      CloseSnackbar(props.snackbarId);
      return;
    }

    const deletionPromises = filteredPrivacyTokens.map((token) => {
      if (!token.urlAtGuest) {
        throw new Error(
          "GuestPrivacyToken URL is null during token removal process."
        );
      }
      return SafeDeleteDataset(token.urlAtGuest);
    });
    Promise.all(deletionPromises).then(() => {
      RevalidateGuestPrivacyTokens();
      CloseSnackbar(props.snackbarId);
    });
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
