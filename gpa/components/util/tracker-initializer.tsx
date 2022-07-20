import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../../common/components/snackbar";
import { Subscribe } from "../../../common/util/tracker/tracker";
import { GetSession } from "../../../common/util/solid";
import { CacheProfile } from "../../../common/util/tracker/profileCache";
import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect, useState } from "react";
import {
  HotelToRdf,
  TrackedRdfFieldCollector,
} from "./tracked-rdf-field-collector";
import { FieldChangeReceiverSnackbar } from "./on-field-change-received";

/**
 * Subscribe to profile changes in the guest's profile.
 * We perceive the updates via the WebSocket publish messages.
 * When an update is received, we trigger the {@link FieldChangeReceiverSnackbar} to allow the user to propagate the changes to the hotels.
 */
async function SubscribeToProfileChanges(profileUrl: string): Promise<void> {
  await Subscribe(profileUrl, {
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

/**
 * Executes a distinct on the personal information fields to get a set of fields tracked by at least one hotel.
 * Caches the values of these fields in memory.
 * Subscribes to updates on the guest profile.
 */
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
  await SubscribeToProfileChanges(webId);
}

/**
 * A snackbar notification displayed in the bottom right corner determining the personal information fields we must currently track.
 * Triggered on every application launch.
 * The values of these fields are cached in memory to help determine the old value if the Solid Pod gets updated.
 * @returns A custom progress snackbar caching the currently tracked personal information field values.
 */
export const UserTrackerInitializerSnackbar = forwardRef<
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
      snackbarKey={props.snackbarId}
      message={"Caching user profile"}
    />
  );
});

UserTrackerInitializerSnackbar.displayName = "UserTrackerInitializerSnackbar";
