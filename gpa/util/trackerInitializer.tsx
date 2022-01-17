import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import { Subscribe } from "../../common/util/tracker/tracker";
import { GetSession } from "../../common/util/solid";
import { CacheProfile } from "../../common/util/tracker/profileCache";
import CustomProgressSnackbar from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect, useState } from "react";
import TrackedRdfFieldCollector, {
  HotelToRdf,
} from "./trackedRdfFieldCollector";
import FieldChangeReceiverSnackbar from "./onFieldChangeReceived";

async function SubscribeToProfileChanges(profileUrl: string): Promise<void> {
  return Subscribe(profileUrl, {
    onClick: () => {
      undefined;
    },
    onReceive: (url) => {
      ShowCustomSnackbar(() => (
        <FieldChangeReceiverSnackbar
          key={"approvalNotificationCreator"}
          url={url}
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
