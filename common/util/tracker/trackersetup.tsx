import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { useGuest } from "../../../common/hooks/useGuest";
import { HotelProfileCache } from "./profileCache";

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
      throw new Error(`Failed to cache hotel profile ${props.profileUrl}`);
    }

    if (!guestFields) {
      console.log("Guest field information null");
      return;
    }

    console.log(guestFields);
    HotelProfileCache[props.profileUrl] = guestFields;
    CloseSnackbar(props.key);
    console.log("cache updated");
  }, [guestFields, guestError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Caching hotel profile"}
    />
  );
});

TrackerSetupSnackbar.displayName = "TrackerSetupSnackbar";

export default TrackerSetupSnackbar;
