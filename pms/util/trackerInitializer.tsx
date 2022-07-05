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
import {
  HotelProfilesUrl,
  ReservationsUrl,
} from "../../common/consts/solidIdentifiers";
import SendProfileModificationSnackbar from "../../common/util/tracker/send-profile-modification";
import {
  CacheProfile,
  ProfileCache,
} from "../../common/util/tracker/profileCache";
import { CustomProgressSnackbar } from "../../common/components/custom-progress-snackbar";
import { SendProfileModification } from "./outgoingCommunications";

export async function SubscribeToProfileChanges(
  profileUrl: string,
  checkedRdfFields: string[]
): Promise<void> {
  const sendModificationId = "sendModification";
  const infoPanelId = "infoPanel";

  return Subscribe(profileUrl, {
    onClick: () => {
      undefined;
    },
    onReceive: (url) => {
      ShowCustomSnackbar(
        () => (
          <SendChangeSnackbar
            snackbarId={infoPanelId}
            profileUrl={url}
            rdfFields={checkedRdfFields}
            requiresApproval={false}
            profileChangeStrings={OutgoingProfileChangeStrings(false)}
            approveButtonFunction={(fieldOptions) => {
              ShowCustomSnackbar(
                () => (
                  <SendProfileModificationSnackbar
                    snackbarId={sendModificationId}
                    fieldOptions={fieldOptions}
                    reservationsUrl={ReservationsUrl}
                    reservationFilter={(reservation) =>
                      reservation !== null && reservation.owner === profileUrl
                    }
                    sendModification={(approvedFields, inboxUrl) =>
                      SendProfileModification(approvedFields, inboxUrl)
                    }
                  />
                ),
                sendModificationId
              );
              //update the in-memory cache
              CacheProfile(url, checkedRdfFields);
            }}
            oldFields={() => ProfileCache[url]}
          />
        ),
        infoPanelId
      );
    },
  });
}

export async function CacheHotelProfiles(): Promise<void> {
  const hotelProfileContainer = await GetDataSet(HotelProfilesUrl);
  const hotelProfileUrls = getContainedResourceUrlAll(hotelProfileContainer);

  let snackbarKey: string | number;
  ShowCustomSnackbar((key) => {
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

    const rdfFields = getPropertyAll(profile.profile);
    await CacheProfile(hotelProfileUrl, rdfFields);

    return SubscribeToProfileChanges(hotelProfileUrl, rdfFields);
  });

  Promise.all(promises).then(() => CloseSnackbar(snackbarKey));
}
