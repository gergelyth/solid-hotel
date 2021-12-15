import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { Subscribe } from "../../common/util/tracker/tracker";
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
import {
  CacheProfile,
  ProfileCache,
} from "../../common/util/tracker/profileCache";
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
      //TODO update cache with new values!
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
          oldFields={() => ProfileCache[url]}
        />
      ));
    },
  });
}

export async function CacheHotelProfiles(): Promise<void> {
  const hotelProfileContainer = await GetDataSet(HotelProfilesUrl);
  const hotelProfileUrls = getContainedResourceUrlAll(hotelProfileContainer);

  let snackbarKey: string | number;
  ShowCustomSnackbar((key) => {
    snackbarKey = key;
    return (
      <CustomProgressSnackbar
        key={key}
        message={`Caching ${hotelProfileUrls.length} profiles`}
      />
    );
  });

  const promises = hotelProfileUrls.map(async (hotelProfileUrl) => {
    hotelProfileUrl += "#hotelProfile";
    const profile = await GetProfileOf(hotelProfileUrl);
    if (!profile?.profile) {
      console.log(`Profile fetch of ${hotelProfileUrl} failed`);
      return;
    }

    const rdfFields = getPropertyAll(profile?.profile);
    await CacheProfile(hotelProfileUrl, rdfFields);

    return SubscribeToProfileChanges(hotelProfileUrl, rdfFields);
  });

  Promise.all(promises).then(() => CloseSnackbar(snackbarKey));
}
