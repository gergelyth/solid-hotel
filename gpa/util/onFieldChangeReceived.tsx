import {
  CloseSnackbar,
  ShowCustomSnackbar,
} from "../../common/components/snackbar";
import SendChangeSnackbar from "../../common/util/tracker/trackerSendChange";
import { OutgoingProfileChangeStrings } from "../../common/util/tracker/profile-change-strings";
import { SendProfileModificationSnackbar } from "../../common/util/tracker/send-profile-modification";
import {
  CacheProfile,
  ProfileCache,
} from "../../common/util/tracker/profile-cache";
import { CustomProgressSnackbar } from "../../common/components/custom-progress-snackbar";
import { forwardRef, useEffect, useState } from "react";
import { GetUserReservationsPodUrl } from "../../common/util/solidReservations";
import { ReservationState } from "../../common/types/ReservationState";
import {
  HotelToRdf,
  TrackedRdfFieldCollector,
} from "./trackedRdfFieldCollector";
import { SendProfileModification } from "./outgoingCommunications";
import { RevalidateGuest } from "../../common/hooks/useGuest";

/**
 * Creates the approval dialog popup for a given hotel in the bottom right corner.
 * Allows the user to choose which field value changes to propagate to the hotel (more information in {@link SendChangeSnackbar} and {@link SendProfileModificationSnackbar}).
 */
function ShowApprovalDialogForHotel(
  webId: string,
  hotelUrl: string,
  rdfFields: string[],
  reservationUrl: string,
  closeFunction: () => void
): void {
  const sendSnackbarId = `hotelApproval${hotelUrl}`;
  const sendProfileId = `sendProfileId${hotelUrl}`;
  ShowCustomSnackbar(
    () => (
      <SendChangeSnackbar
        snackbarId={sendSnackbarId}
        profileUrl={webId}
        rdfFields={rdfFields}
        requiresApproval={true}
        profileChangeStrings={OutgoingProfileChangeStrings(true)}
        approveButtonFunction={(fieldOptions) => {
          ShowCustomSnackbar(
            () => (
              <SendProfileModificationSnackbar
                snackbarId={sendProfileId}
                fieldOptions={fieldOptions}
                reservationsUrl={reservationUrl}
                reservationFilter={(reservation) =>
                  reservation !== null &&
                  reservation.state === ReservationState.ACTIVE &&
                  reservation.hotel === hotelUrl
                }
                sendModification={(approvedFields, inboxUrl) =>
                  SendProfileModification(approvedFields, inboxUrl)
                }
              />
            ),
            sendProfileId
          );
          //update the in-memory cache
          CacheProfile(webId, rdfFields);
        }}
        oldFields={() => ProfileCache[webId]}
        closeActionCallback={() => {
          closeFunction();
          RevalidateGuest(rdfFields, webId);
          //we update the in-memory cache even if we decide not to send the update to the hotel
          CacheProfile(webId, rdfFields);
        }}
        hotelUrl={hotelUrl}
      />
    ),
    sendSnackbarId
  );
}

/**
 * Creates the close function for the given hotel's field approval dialog to trigger the dialog for the next hotel in order.
 * The last hotel's dialog in the chain triggers nothing and closes the dialog only.
 * @returns The closing function of the approval dialog snackbar.
 */
function GetCloseFunctionForIndex(
  webId: string,
  reservationUrl: string,
  hotelRdfMap: HotelToRdf,
  hotelKeys: string[],
  i: number
): () => void {
  if (i >= Object.keys(hotelRdfMap).length - 1) {
    return () => undefined;
  }

  const hotel = hotelKeys[i];
  const rdfFields = Array.from(hotelRdfMap[hotel]);

  return () =>
    ShowApprovalDialogForHotel(
      webId,
      hotel,
      rdfFields,
      reservationUrl,
      GetCloseFunctionForIndex(
        webId,
        reservationUrl,
        hotelRdfMap,
        hotelKeys,
        i + 1
      )
    );
}

/**
 * Go through the hotels and trigger a field approval dialog for each of them.
 * The closing function of a popup either triggers the popup for the next hotel or ends the chain.
 */
function IterateHotelsAndCreateApprovalDialogs(
  webId: string,
  hotelRdfMap: HotelToRdf
): void {
  const reservationUrl = GetUserReservationsPodUrl();
  if (!reservationUrl) {
    console.log("Reservation url null");
    return;
  }

  //we show approval dialogs one after another
  const hotels = Object.keys(hotelRdfMap);
  ShowApprovalDialogForHotel(
    webId,
    hotels[0],
    Array.from(hotelRdfMap[hotels[0]]),
    reservationUrl,
    GetCloseFunctionForIndex(webId, reservationUrl, hotelRdfMap, hotels, 1)
  );
}

/**
 * A custom progress snackbar shown when at least one tracked personal information field's value is changed in the guest Pod.
 * Firstly we gather what fields are currently in use at the side of hotels where the guest has a reservation and categorize them by the hotel.
 * Then we show sequential dialogs offering the option to the user to separately choose which hotel should receive which field update (only for fields they currently possess).
 * @returns A custom progress snackbar while all the data is being initialized. Triggers the approval dialog popups once everything's ready.
 */
export const FieldChangeReceiverSnackbar = forwardRef<
  HTMLDivElement,
  {
    snackbarId: string | number;
    url: string;
  }
>((props, ref) => {
  const [hotelRdfMap, setHotelRdfMap] = useState<HotelToRdf>();

  useEffect(() => {
    console.log("field change receiver effect started");

    if (!hotelRdfMap) {
      console.log(
        "Hotel to RDF fields map not yet set - triggering collection"
      );

      const guestFieldCollector = "guestFieldCollector";
      ShowCustomSnackbar(
        () => (
          <TrackedRdfFieldCollector
            snackbarId={guestFieldCollector}
            setHotelToRdfMap={setHotelRdfMap}
          />
        ),
        guestFieldCollector
      );

      return;
    }

    IterateHotelsAndCreateApprovalDialogs(props.url, hotelRdfMap);
    CloseSnackbar(props.snackbarId);
  }, [hotelRdfMap]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      snackbarKey={props.snackbarId}
      message={"Creating field change notifications"}
    />
  );
});

FieldChangeReceiverSnackbar.displayName = "FieldChangeReceiverSnackbar";
