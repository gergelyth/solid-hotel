import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { useGuest } from "../../../common/hooks/useGuest";
import { ProfileCache } from "./profileCache";

const TrackerSetupSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    profileUrl: string;
    rdfFields: string[];
  }
>((props, ref) => {
  const { guestFields, isError: guestError } = useGuest(
    props.rdfFields,
    props.profileUrl
  );

  useEffect(() => {
    if (guestError) {
      CloseSnackbar(props.key);
      throw new Error(`Failed to cache profile ${props.profileUrl}`);
    }

    if (!guestFields) {
      return;
    }

    ProfileCache[props.profileUrl] = guestFields.map((x) => ({ ...x }));
    CloseSnackbar(props.key);
    console.log("Profile cache updated");
  }, [guestFields, guestError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Caching profiles"}
    />
  );
});

TrackerSetupSnackbar.displayName = "TrackerSetupSnackbar";

export default TrackerSetupSnackbar;
