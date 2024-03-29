import { SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";
import { DeserializeReservationStateChange } from "../../common/notifications/reservationStateChange";
import { DeserializeBookingRequest } from "../../common/notifications/bookingRequest";
import { DeserializeInitialPairingRequest } from "../../common/notifications/initialPairingRequest";
import { DeserializePrivacyInformationDeletion } from "../../common/notifications/privacyInformationDeletion";
import { DeserializeProfileModification } from "../../common/notifications/profileModification";
import { ReservationState } from "../../common/types/ReservationState";
import { DoOnStateChange } from "./actionOnNewReservationState";
import {
  ConfirmReservationStateRequest,
  SendPairingRequestWithInformation,
  SendPrivacyToken,
} from "./outgoingCommunications";
import {
  GetCoreReservationFolderFromInboxUrl,
  GetReservationIdFromInboxUrl,
  GetReservationUrlFromInboxUrl,
} from "../../common/util/urlParser";
import {
  DeletePairingToken,
  GetPairingToken,
} from "../../common/util/pairingTokenHandler";
import {
  ShowCustomSnackbar,
  ShowErrorSnackbar,
  ShowSuccessSnackbar,
} from "../../common/components/snackbar";
import {
  AddReservation,
  GetOwnerFromReservation,
  SetEmailAddressOfGuest,
} from "../../common/util/solidReservations";
import {
  ConvertToHotelPrivacyToken,
  RevalidateHotelPrivacyTokens,
} from "../../common/hooks/usePrivacyTokens";
import { GetDataSet } from "../../common/util/solid";
import {
  AnonymizeFieldsAndDeleteToken,
  AnonymizeInboxInNotification,
  CreateReservationPrivacyToken,
  HandleIrregularTokenDeletion,
} from "./privacyHelper";
import SendChangeSnackbar from "../../common/components/profilesync/tracker-send-change";
import { IncomingProfileChangeStrings } from "../../common/util/tracker/profileChangeStrings";
import { UpdateLocalProfileSnackbar } from "../../common/components/profile/update-local-profile";
import { RevalidateReservations } from "../../common/hooks/useReservations";
import { GetEmailFromProfile } from "../../common/util/solidProfile";
import { ReservationStateRdfMap } from "../../common/vocabularies/rdfReservationStatusTypes";

/**
 * Included in the {@link PMSParsers} list which defines the text, onClick and onReceive fields for the receipt of a reservation state change notification.
 * The onClick function takes the user to the index/reservations page.
 * The onReceive function sets the new reservation state and performs the state specific operation - this is delegated to the {@link DoOnStateChange} function.
 * @returns The notification properties described above along with the text field, which informs the user of the reservation state change.
 */
export function ReceiveReservationStateChange(
  router: NextRouter,
  notificationUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { reservationId, newState, replyInbox } =
    DeserializeReservationStateChange(notificationUrl, dataset, true);
  const text = `The state [${ReservationStateRdfMap[newState]}] was set for reservation [${reservationId}].\nClick to view reservations.`;
  const onClick = (): void => {
    router.push("/");
  };
  const onReceive = (): void => {
    DoOnStateChange(reservationId, newState, replyInbox);
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link PMSParsers} list which defines the text, onClick and onReceive fields for the receipt of a booking request notification.
 * The onClick function takes the user to the reservations page.
 * The onReceive function (since we auto confirm all reservations) creates the reservation in the hotel Pod, reports the confirmation to the user and creates the required privacy tokens for a confirmed reservation.
 * @returns The notification properties described above along with the text field, which informs the user of the new reservation.
 */
export function ReceiveBookingRequest(
  router: NextRouter,
  bookingRequestUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const text = `A new reservation was requested.\nSensitive information censored.\nThe booking was automatically confirmed.`;
  const onClick = (): void => {
    router.push("/");
  };
  const onReceive = async (): Promise<void> => {
    const reservation = DeserializeBookingRequest(dataset, true);
    const reservationInbox = reservation.inbox;
    if (!reservationInbox) {
      ShowErrorSnackbar("Inbox is null in received reservation request");
      return;
    }

    reservation.state = ReservationState.CONFIRMED;
    const hotelInboxUrl = await AddReservation(reservation, reservation.owner);

    const email = await GetEmailFromProfile(reservation.owner);
    if (email !== "") {
      SetEmailAddressOfGuest(hotelInboxUrl, email);
    }

    RevalidateReservations();
    ConfirmReservationStateRequest(
      ReservationState.CONFIRMED,
      reservationInbox,
      hotelInboxUrl
    );

    const privacyTokens = await CreateReservationPrivacyToken(
      GetReservationUrlFromInboxUrl(hotelInboxUrl),
      reservationInbox,
      reservation
    );
    privacyTokens.forEach((tokenDataset) => {
      SendPrivacyToken(reservationInbox, tokenDataset);
    });
    RevalidateHotelPrivacyTokens();
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link PMSParsers} list which defines the text, onClick and onReceive fields for the receipt of a profile modification notification.
 * The onClick function displays a snackbar which lets the guess choose which field updates to propagate to their Solid Pod.
 * The onReceive function does nothing.
 * @returns The notification properties described above along with the text field, which informs the user that a notification was received.
 */
export function ReceiveProfileModification(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const text = `A guest changed a field in their Solid Pod and is trying to propagate the change to the hotel's side.\nClick here to review.`;
  const onClick = async (): Promise<void> => {
    const reservationId = GetReservationIdFromInboxUrl(hotelInboxUrl);
    const reservationOwner = await GetOwnerFromReservation(reservationId);
    if (!reservationOwner) {
      throw new Error(
        `Reservation ${reservationId} doesn't have an owner in ReceiveProfileModification`
      );
    }

    const fieldChanges = DeserializeProfileModification(dataset);

    const approveSnackbarId = "approveSnackbar";

    ShowCustomSnackbar(
      () => (
        <SendChangeSnackbar
          snackbarId={approveSnackbarId}
          profileUrl={reservationOwner}
          rdfFields={Object.keys(fieldChanges)}
          requiresApproval={true}
          profileChangeStrings={IncomingProfileChangeStrings()}
          approveButtonFunction={(fieldOptions) =>
            ShowCustomSnackbar((key) => (
              <UpdateLocalProfileSnackbar
                snackbarKey={key}
                profileUrl={reservationOwner}
                fieldOptions={fieldOptions}
              />
            ))
          }
          newValues={fieldChanges}
        />
      ),
      approveSnackbarId
    );
    //TODO delete notification?
  };
  const onReceive = (): void => undefined;

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link PMSParsers} list which defines the text, onClick and onReceive fields for the receipt of the pairing request notification.
 * The onClick function does nothing.
 * The onReceive function checks if the pairing token matches the one sent by the guest and replies to the guest with the reservation information as well as the personal information filled out during offline check-in.
 * @returns The notification properties described above along with the text field, which informs the user that a pairing request was received.
 */
export function ReceiveInitialPairingRequest(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const { guestInboxUrl, token: receivedToken } =
    DeserializeInitialPairingRequest(dataset, true);

  const inboxFolder =
    hotelInboxUrl.replace(new RegExp("inbox.*$"), "") + "inbox";
  const coreReservationFolder =
    GetCoreReservationFolderFromInboxUrl(inboxFolder);

  const reservationUrl = GetReservationUrlFromInboxUrl(inboxFolder);

  const text = `Pairing request received for reservation [${reservationUrl}].`;
  const onClick = (): void => undefined;
  const onReceive = async (): Promise<void> => {
    const expectedPairingToken = await GetPairingToken(coreReservationFolder);
    if (!expectedPairingToken) {
      ShowErrorSnackbar(
        `Pairing token not found in the hotel pod for reservation [${reservationUrl}]`
      );
      return;
    }

    if (receivedToken != expectedPairingToken) {
      ShowErrorSnackbar(
        `Request pairing token [${receivedToken}] not matching the expected token [${expectedPairingToken}]`
      );
      return;
    }

    ShowSuccessSnackbar(
      `Pairing request for [${reservationUrl}] successful. Sending information to guest.`
    );
    await SendPairingRequestWithInformation(
      reservationUrl,
      inboxFolder,
      guestInboxUrl
    );

    await DeletePairingToken(coreReservationFolder);
  };

  return { text, onClick, onReceive };
}

/**
 * Included in the {@link PMSParsers} list which defines the text, onClick and onReceive fields for the receipt of the privacy token deletion request notification.
 * The onClick function does nothing.
 * The onReceive function parses the hotel privacy token in question, checks that it's past its expiration date and if so, anonymizes the required fields and deletes the token of which the guest is then informed.
 * @returns The notification properties described above along with the text field, which informs the user that a privacy token deletion request was received.
 */
export function ReceivePrivacyTokenDeletionRequest(
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
): {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
} {
  const text = `A privacy token was requested to be deleted via [${hotelInboxUrl}].`;
  const onClick = (): void => undefined;
  const onReceive = async (): Promise<void> => {
    const { tokenUrl, guestInboxUrl } = DeserializePrivacyInformationDeletion(
      dataset,
      true
    );

    const tokenDataset = await GetDataSet(tokenUrl);

    const privacyToken = ConvertToHotelPrivacyToken(tokenDataset);
    if (!privacyToken) {
      throw new Error(`Parsing of privacy token ${tokenUrl} failed`);
    }

    if (privacyToken.expiry >= new Date()) {
      ShowErrorSnackbar(
        "Privacy token have not expired yet. Deletion request denied."
      );
      return;
    }

    //We check if this is an "irregular" request, i.e. the reservation didn't go through the
    //standard workflow when this request was made and allowed
    if (await HandleIrregularTokenDeletion(privacyToken)) {
      return;
    }

    if (guestInboxUrl) {
      await AnonymizeInboxInNotification(dataset);
    }

    await AnonymizeFieldsAndDeleteToken(privacyToken, guestInboxUrl);
    // RevalidateHotelPrivacyTokens();
  };

  return { text, onClick, onReceive };
}
