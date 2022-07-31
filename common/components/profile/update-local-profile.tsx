import { CustomProgressSnackbar } from "../custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import { CloseSnackbar, ShowWarningSnackbar } from "../snackbar";
import { ProfileUpdate } from "../profilesync/tracker-send-change";
import { SetMultipleFieldsInProfile } from "../../util/solidProfile";
import { UpdateProfileInMemory } from "../../util/tracker/profileCache";
import { IgnoreNextUpdate } from "../../util/tracker/tracker";
import { RevalidateGuest } from "../../hooks/useGuest";

/**
 * Executes the update of the local profile.
 * Displays a warning message if there are no approved fields to update the profile with.
 * If there is at least one approved field, the Solid Pod profile and the in-memory cache is updated.
 */
async function ExecuteUpdateLocalProfile(
  profileUrl: string,
  fieldOptions: ProfileUpdate
): Promise<void> {
  const approvedFields = Object.keys(fieldOptions).reduce(function (
    filtered: {
      [rdfName: string]: string;
    },
    key
  ) {
    if (fieldOptions[key].status) {
      filtered[key] = fieldOptions[key].newValue;
    }
    return filtered;
  }, {});

  if (Object.keys(approvedFields).length === 0) {
    ShowWarningSnackbar(
      "There are no approved fields to save. Saving nothing."
    );
    return;
  }

  //Ignore the next update so the profile update doesn't cause an unending loop
  IgnoreNextUpdate(profileUrl);

  await SetMultipleFieldsInProfile(profileUrl, approvedFields);
  UpdateProfileInMemory(profileUrl, fieldOptions);

  // RevalidateGuest(Object.keys(approvedFields), profileUrl);
}

/**
 * Executes the update of the local profile.
 * Displays a warning message if there are no approved fields to update the profile with.
 * If there is at least one approved field, the Solid Pod profile and the in-memory cache is updated.
 * @returns A progress snackbar which updates the local profile in useEffect().
 */
export const UpdateLocalProfileSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarKey: string | number;
    profileUrl: string;
    fieldOptions: ProfileUpdate;
  }
>((props, ref) => {
  useEffect(() => {
    Promise.all([
      new Promise((res) => setTimeout(res, 2000)),
      ExecuteUpdateLocalProfile(props.profileUrl, props.fieldOptions),
    ]).then(() => CloseSnackbar(props.snackbarKey));
  }, []);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarKey}
      message={"Updating local profile"}
    />
  );
});

UpdateLocalProfileSnackbar.displayName = "UpdateLocalProfileSnackbar";
