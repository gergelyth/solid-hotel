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
      const snackbarId = "approvalNotificationCreator";
      ShowCustomSnackbar(
        () => <FieldChangeReceiverSnackbar snackbarId={snackbarId} url={url} />,
        snackbarId
      );
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
    snackbarId: string | number;
  }
>((props, ref) => {
  const [hotelRdfMap, setHotelRdfMap] = useState<HotelToRdf>();

  useEffect(() => {
    console.log("user tracker initialize effect started");

    if (!hotelRdfMap) {
      console.log(
        "Hotel to RDF fields map not yet set - triggering collection"
      );

      const snackbarId = "guestFieldCollector";
      ShowCustomSnackbar(
        () => (
          <TrackedRdfFieldCollector
            snackbarId={snackbarId}
            setHotelToRdfMap={setHotelRdfMap}
          />
        ),
        snackbarId
      );

      return;
    }

    CacheUserProfile(hotelRdfMap).then(() => CloseSnackbar(props.snackbarId));
  }, [hotelRdfMap]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.snackbarId}
      message={"Caching user profile"}
    />
  );
});

UserTrackerInitializerSnackbar.displayName = "UserTrackerInitializerSnackbar";

export default UserTrackerInitializerSnackbar;
