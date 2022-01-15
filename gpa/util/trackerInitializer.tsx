import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { Subscribe } from "../../common/util/tracker/tracker";
import SendChangeSnackbar from "../../common/util/tracker/trackerSendChange";
import { GetProfile, GetProfileOf } from "../../common/util/solid_profile";
import {
  getContainedResourceUrlAll,
  getPropertyAll,
} from "@inrupt/solid-client";
import { OutgoingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import {
  GetDataSet,
  GetSession,
  GetUserPrivacyPodUrl,
} from "../../common/util/solid";
import {
  HotelProfilesUrl,
  ReservationsUrl,
} from "../../common/consts/solidIdentifiers";
import SendProfileModificationSnackbar from "../../common/util/tracker/send-profile-modification";
import {
  CacheProfile,
  ProfileCache,
} from "../../common/util/tracker/profileCache";
import CustomProgressSnackbar from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect, useState } from "react";
import { usePrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { useReservations } from "../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import TrackedRdfFieldCollector, {
  HotelToRdf,
} from "./trackedRdfFieldCollector";

async function SubscribeToProfileChanges(profileUrl: string): Promise<void> {
  return Subscribe(profileUrl, {
    onClick: () => {
      undefined;
    },
    onReceive: (url) => {
      const reservationUrl = GetUserReservationsPodUrl();
      if (!reservationUrl) {
        console.log("Reservation url null");
        return;
      }
      ShowCustomSnackbar((key) => (
        <SendChangeSnackbar
          key={key}
          profileUrl={url}
          rdfFields={checkedRdfFields}
          requiresApproval={true}
          profileChangeStrings={OutgoingProfileChangeStrings(true)}
          approveButtonFunction={(fieldOptions) => {
            ShowCustomSnackbar((key) => (
              <SendProfileModificationSnackbar
                key={key}
                fieldOptions={fieldOptions}
                reservationsUrl={reservationUrl}
                reservationFilter={(reservation) =>
                  reservation !== null && reservation.owner === profileUrl
                }
              />
            ));
            //update the in-memory cache
            CacheProfile(url, checkedRdfFields);
          }}
          oldFields={() => ProfileCache[url]}
        />
      ));
    },
  });
}

async function CacheUserProfile(hotelRdfMap: HotelToRdf): Promise<void> {
  const webId = GetSession().info.webId;
  if (!webId) {
    console.log("Null webId, can't subscribe");
    return;
  }

  const rdfFields = new Set<string>();
  Object.values(hotelRdfMap).forEach((hotelSet) => {
    hotelSet.forEach((rdf) => {
      rdfFields.add(rdf);
    });
  });

  await CacheProfile(webId, Array.from(rdfFields));
  return SubscribeToProfileChanges(webId);
}

const UserTrackerInitializerSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
  }
>((props, ref) => {
  const [hotelRdfMap, setHotelRdfMap] = useState<HotelToRdf>();

  useEffect(() => {
    console.log("effect started");
    ShowCustomSnackbar(() => (
      <TrackedRdfFieldCollector
        key={"guestFieldCollector"}
        setHotelToRdfMap={setHotelRdfMap}
      />
    ));

    if (!hotelRdfMap) {
      console.log("Hotel to RDF fields map not yet set");
      return;
    }

    CacheUserProfile(hotelRdfMap).then(() => CloseSnackbar(props.key));
  }, [hotelRdfMap]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.key}
      message={"Caching user profile"}
    />
  );
});

UserTrackerInitializerSnackbar.displayName = "UserTrackerInitializerSnackbar";

export default UserTrackerInitializerSnackbar;
