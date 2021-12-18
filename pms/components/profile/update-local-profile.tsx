import CustomProgressSnackbar from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect } from "react";
import {
  CloseSnackbar,
  ShowWarningSnackbar,
} from "../../../common/components/snackbar";
import { ProfileUpdate } from "../../../common/util/tracker/trackerSendChange";
import { SetMultipleFieldsInProfile } from "../../../common/util/solid_profile";
import { UpdateProfileInMemory } from "../../../common/util/tracker/profileCache";

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

  await SetMultipleFieldsInProfile(profileUrl, approvedFields);
  UpdateProfileInMemory(profileUrl, fieldOptions);

  console.log("local profile updated");
}

const UpdateLocalProfileSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    profileUrl: string;
    fieldOptions: ProfileUpdate;
  }
>((props, ref) => {
  useEffect(() => {
    Promise.all([
      new Promise((res) => setTimeout(res, 2000)),
      ExecuteUpdateLocalProfile(props.profileUrl, props.fieldOptions),
    ]).then(() => CloseSnackbar(props.key));
  }, []);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Updating local profile"}
    />
  );
});

UpdateLocalProfileSnackbar.displayName = "UpdateLocalProfileSnackbar";

export default UpdateLocalProfileSnackbar;
