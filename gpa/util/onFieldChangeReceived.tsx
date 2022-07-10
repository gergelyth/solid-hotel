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
import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { ReservationState } from "../../common/types/ReservationState";
import TrackedRdfFieldCollector, {
  HotelToRdf,
} from "./trackedRdfFieldCollector";
import { SendProfileModification } from "./outgoingCommunications";
import { RevalidateGuest } from "../../common/hooks/useGuest";

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

const FieldChangeReceiverSnackbar = forwardRef<
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
      key={props.snackbarId}
      message={"Creating field change notifications"}
    />
  );
});

FieldChangeReceiverSnackbar.displayName = "FieldChangeReceiverSnackbar";

export default FieldChangeReceiverSnackbar;
