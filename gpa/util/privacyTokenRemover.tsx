import {
  CloseSnackbar,
  ShowWarningSnackbar,
} from "../../common/components/snackbar";
import { GetSession, GetUserPrivacyPodUrl } from "../../common/util/solid";
import { CustomProgressSnackbar } from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import {
  RevalidateGuestPrivacyTokens,
  useGuestPrivacyTokens,
} from "../../common/hooks/usePrivacyTokens";
import { deleteSolidDataset } from "@inrupt/solid-client";
import { NotEmptyItem, ShowError } from "../../common/util/helpers";

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

    const session = GetSession();
    const deletionPromises = filteredPrivacyTokens.map((token) => {
      if (!token.urlAtGuest) {
        throw new Error(
          "GuestPrivacyToken URL is null during token removal process."
        );
      }
      return deleteSolidDataset(token.urlAtGuest, { fetch: session.fetch });
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

export default PrivacyTokenRemover;
