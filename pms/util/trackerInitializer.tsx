import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { Subscribe } from "../../common/util/tracker/tracker";
import TrackerSetupSnackbar from "../../common/util/tracker/trackerSetupSnackbar";
import SendChangeSnackbar from "../../common/util/tracker/trackerSendChange";
import { GetProfileOf } from "../../common/util/solid_profile";
import {
  getContainedResourceUrlAll,
  getPropertyAll,
} from "@inrupt/solid-client";
import { OutgoingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import { GetDataSet } from "../../common/util/solid";
import { HotelProfilesUrl } from "../../common/consts/solidIdentifiers";
import SendProfileModificationSnackbar from "../components/profile/send-profile-modification";
import { ProfileCache } from "../../common/util/tracker/profileCache";
import CustomProgressSnackbar from "../../common/components/custom-progress-snackbar";

async function SubscribeToProfileChanges(
  profileUrl: string,
  checkedRdfFields: string[]
): Promise<void> {
  return Subscribe(profileUrl, {
    onClick: () => {
      undefined;
    },
    onReceive: (url) => {
      ShowCustomSnackbar((key) => (
        <SendChangeSnackbar
          key={key}
          profileUrl={url}
          rdfFields={checkedRdfFields}
          requiresApproval={false}
          profileChangeStrings={OutgoingProfileChangeStrings(false)}
          approveButtonFunction={(fieldOptions) =>
            ShowCustomSnackbar((key) => (
              <SendProfileModificationSnackbar
                key={key}
                fieldOptions={fieldOptions}
                profileUrl={url}
              />
            ))
          }
          oldFields={ProfileCache[url]}
        />
      ));
    },
  });
}

export async function CacheHotelProfiles(): Promise<void> {
  const hotelProfileContainer = await GetDataSet(HotelProfilesUrl);
  const hotelProfileUrls = getContainedResourceUrlAll(hotelProfileContainer);

  const snackbarKey = "cachingSnackbar";
  ShowCustomSnackbar(() => (
    <CustomProgressSnackbar
      key={snackbarKey}
      message={`Caching ${hotelProfileUrls.length} profiles`}
    />
  ));

  const promises = [];
  for (let hotelProfileUrl of hotelProfileUrls) {
    hotelProfileUrl += "#hotelProfile";
    const profile = await GetProfileOf(hotelProfileUrl);
    if (!profile?.profile) {
      console.log(`Profile fetch of ${hotelProfileUrl} failed`);
      continue;
    }
    const rdfFields = getPropertyAll(profile?.profile);

    ShowCustomSnackbar(
      (key) => (
        <TrackerSetupSnackbar
          key={key}
          profileUrl={hotelProfileUrl}
          rdfFields={rdfFields}
        />
      ),
      true
    );

    promises.push(SubscribeToProfileChanges(hotelProfileUrl, rdfFields));
    console.log("subscribed in index");
  }

  Promise.all(promises).then(() => CloseSnackbar(snackbarKey));
}
