import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { Subscribe } from "../../common/util/tracker/tracker";
import SendChangeSnackbar from "../../common/components/profilesync/tracker-send-change";
import { GetProfileOf } from "../../common/util/solidProfile";
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
import { SendProfileModificationSnackbar } from "../../common/components/profilesync/send-profile-modification";
import {
  CacheProfile,
  ProfileCache,
} from "../../common/util/tracker/profileCache";
import { CustomProgressSnackbar } from "../../common/components/custom-progress-snackbar";
import { SendProfileModification } from "./outgoingCommunications";

/**
 * Subscribe to profile changes in a given hotel profile.
 * We perceive the updates via the WebSocket publish messages.
 * When an update is received, we trigger the {@link SendChangeSnackbar} snackbar to inform the hotel employee that the field changes are being propagated to the guest.
 */
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

/**
 * A function gathering the hotel profiles of the guests currently having an active reservation, caching the field values and subscribing to the updates via WebSocket notifications.
 * Triggered on every application launch.
 * The values of these fields are cached in memory to help determine the old value if the Solid Pod gets updated.
 * Shows a progress snackbar in the bottom right corner to indicate this background activity.
 */
export async function CacheHotelProfiles(): Promise<void> {
  const hotelProfileContainer = await GetDataSet(HotelProfilesUrl);
  const hotelProfileUrls = getContainedResourceUrlAll(hotelProfileContainer);

  let snackbarKey: string | number;
  ShowCustomSnackbar((key) => {
    return (
      <CustomProgressSnackbar
        snackbarKey={key}
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
