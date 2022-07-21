import {
  getSourceUrl,
  getThingAll,
  setStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import {
  ShowCustomSnackbar,
  ShowWarningSnackbar,
} from "../../common/components/snackbar";
import {
  PrivacyTokensInboxUrl,
  PrivacyTokensUrl,
} from "../../common/consts/solidIdentifiers";
import { RevalidateHotelPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../../common/types/HotelPrivacyToken";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { CreateHotelPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { GetStartOfNextDay, ShowError } from "../../common/util/helpers";
import { GetDataSet, GetSession, GetThing } from "../../common/util/solid";
import { GetParsedReservationFromUrl } from "../../common/util/solidReservations";
import {
  SafeDeleteDataset,
  SafeSaveDatasetAt,
  SafeSaveDatasetInContainer,
} from "../../common/util/solidWrapper";
import { CreateReservationUrlFromReservationId } from "../../common/util/urlParser";
import { PrivacyDeletionToRdfMap } from "../../common/vocabularies/notificationpayloads/rdfPrivacyDeletion";
import { PersonFieldToRdfMap } from "../../common/vocabularies/rdfPerson";
import { ReservationFieldToRdfMap } from "../../common/vocabularies/rdfReservation";
import { CheckoutProgressSnackbar } from "../components/checkout/checkout-progress-snackbar";
import { ConfirmCancellation } from "../components/reservations/reservation-element";
import { SendPrivacyTokenDeletionNotice } from "./outgoingCommunications";

/**
 * Retrieves the dataset represented by the URL and anonymizes the fields included in the array passed to the function.
 * Saves the updated dataset to the Pod afterwards.
 */
async function AnonymizeFields(
  datasetUrlTarget: string,
  fieldList: string[]
): Promise<void> {
  let targetDataset = await GetDataSet(datasetUrlTarget);

  const containedThings = getThingAll(targetDataset);
  if (containedThings.length !== 1) {
    throw new Error("Only 1 contained thing is supported at the moment");
  }

  let thing = containedThings[0];
  fieldList.forEach((field) => {
    thing = setStringNoLocale(thing, field, "Anonymized");
  });

  targetDataset = setThing(targetDataset, thing);
  await SafeSaveDatasetAt(datasetUrlTarget, targetDataset);
}

/**
 * Anonymizes the fields listed in the privacy token in the dataset referred to by the privacy token.
 * After this, the privacy token is deleted from the Pod.
 * Optionally accepts the guest reply inbox parameter where the hotel can submit the deletion notice (if not supplied, the inbox URL in the privacy token is used).
 */
export async function AnonymizeFieldsAndDeleteToken(
  privacyToken: HotelPrivacyToken,
  guestInboxUrl?: string
): Promise<void> {
  if (!privacyToken.datasetUrlTarget) {
    throw new Error("Privacy token target URL is null");
  }

  await AnonymizeFields(privacyToken.datasetUrlTarget, privacyToken.fieldList);
  await DeletePrivacyToken(privacyToken, guestInboxUrl);
}

/**
 * Deletes the privacy token in the Solid Pod and sends a notice to the guest about it.
 * Optionally accepts the guest reply inbox parameter where the hotel can submit the deletion notice (if not supplied, the inbox URL in the privacy token is used).
 */
async function DeletePrivacyToken(
  privacyToken: HotelPrivacyToken,
  guestInboxUrl?: string
): Promise<void> {
  if (!privacyToken.urlAtHotel) {
    throw new Error("Privacy token URL is null. Cannot process/delete");
  }
  await SafeDeleteDataset(privacyToken.urlAtHotel);
  await SendPrivacyTokenDeletionNotice(privacyToken, guestInboxUrl);
  RevalidateHotelPrivacyTokens();
}

/**
 * Creates the appropriate privacy tokens for a confirmed reservation (WebId and inbox).
 * Saves the hotel privacy tokens to the hotel Pod and returns the guest privacy tokens meant for the guest.
 * @returns An array of tokens containing the two guest privacy tokens which are then sent to the guest.
 */
export async function CreateReservationPrivacyToken(
  reservationUrl: string,
  guestInbox: string,
  reservation: ReservationAtHotel
): Promise<GuestPrivacyToken[]> {
  const webIdToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [ReservationFieldToRdfMap.owner],
    GetStartOfNextDay(reservation.dateTo),
    "Required WebId to identify user and allow access to the reservation inbox",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  const emailToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [PersonFieldToRdfMap.email],
    GetStartOfNextDay(reservation.dateFrom),
    "Required information to chase down the guest if they disappear",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  const inboxToken = CreateInboxPrivacyToken(
    reservationUrl,
    guestInbox,
    reservation
  );

  return Promise.all([webIdToken, inboxToken, emailToken]);
}

/**
 * Creates the inbox privacy token for a confirmed reservation.
 * Saves the hotel privacy token to the hotel Pod and returns the guest privacy token meant for the guest.
 * @returns A guest privacy token about their inbox which is then sent to the guest.
 */
export async function CreateInboxPrivacyToken(
  reservationUrl: string,
  guestInbox: string,
  reservation: ReservationAtHotel
): Promise<GuestPrivacyToken> {
  const inboxToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [ReservationFieldToRdfMap.inbox],
    GetStartOfNextDay(reservation.dateTo),
    "Reservation inbox used for communication with the hotel",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  return inboxToken;
}

/**
 * Creates the active hotel profile privacy token for an active reservation.
 * Saves the hotel privacy token to the hotel Pod and returns the guest privacy token meant for the guest.
 * @returns A guest privacy token about their hotel profile which is then sent to the guest.
 */
export async function CreateActiveProfilePrivacyToken(
  datasetUrlTarget: string,
  guestInbox: string,
  reservationUrl: string,
  fields: string[],
  expiryDate: Date
): Promise<GuestPrivacyToken> {
  return SaveHotelAndCreateGuestPrivacyToken(
    datasetUrlTarget,
    fields,
    expiryDate,
    "Local profile copy made for an active reservation",
    ReservationState.ACTIVE,
    guestInbox,
    reservationUrl
  );
}

/**
 * Creates the data protection profile privacy token for a past reservation.
 * Saves the hotel privacy token to the hotel Pod and returns the guest privacy token meant for the guest.
 * @returns A guest privacy token about their data protection profile which is then sent to the guest.
 */
export async function CreateDataProtectionProfilePrivacyToken(
  datasetUrlTarget: string,
  reservationUrl: string,
  fields: string[],
  expiryDate: Date
): Promise<GuestPrivacyToken> {
  return SaveHotelAndCreateGuestPrivacyToken(
    datasetUrlTarget,
    fields,
    expiryDate,
    "Local profile copy made for preserving data protection information",
    ReservationState.PAST,
    //we're not saving the inbox anymore in the privacy token, because we don't need it
    //the hotel will no longer manipulate with this on its own volition
    undefined,
    reservationUrl
  );
}

/**
 * Creates the privacy token according to the arguments supplied.
 * Saves the hotel privacy token to the hotel Pod and returns the guest privacy token meant for the guest.
 * @returns A guest privacy token which is then sent to the guest.
 */
async function SaveHotelAndCreateGuestPrivacyToken(
  datasetUrlTarget: string,
  fields: string[],
  expiryDate: Date,
  reason: string,
  forReservationState: ReservationState,
  guestInbox: string | undefined,
  reservationUrl: string
): Promise<GuestPrivacyToken> {
  const session = GetSession();

  const hotelWebId = session.info.webId;
  if (!hotelWebId) {
    throw new Error("Hotel not logged in. This should never happen");
  }

  const privacyToken: PrivacyToken = {
    urlAtHotel: null,
    fieldList: fields,
    reason: reason,
    forReservationState: forReservationState,
    expiry: expiryDate,
  };

  const hotelPrivacyToken: HotelPrivacyToken = {
    ...privacyToken,
    datasetUrlTarget: datasetUrlTarget,
    guestInbox: guestInbox,
    reservation: reservationUrl,
  };

  const hotelPrivacyTokenDataset =
    CreateHotelPrivacyTokenDataset(hotelPrivacyToken);
  const savedDataset = await SafeSaveDatasetInContainer(
    PrivacyTokensUrl,
    hotelPrivacyTokenDataset
  );

  const guestPrivacyToken: GuestPrivacyToken = {
    ...privacyToken,
    hotelInboxForDeletion: PrivacyTokensInboxUrl,
    hotel: hotelWebId,
    urlAtGuest: undefined,
    reservation: undefined,
  };

  if (!savedDataset) {
    ShowError(
      "Because of the dataset saving failure above, we didn't get an URL to continue here",
      false
    );
    return guestPrivacyToken;
  }

  guestPrivacyToken.urlAtHotel = getSourceUrl(savedDataset);

  hotelPrivacyToken.urlAtHotel = guestPrivacyToken.urlAtHotel;
  const newHotelPrivacyToken =
    CreateHotelPrivacyTokenDataset(hotelPrivacyToken);
  await SafeSaveDatasetAt(hotelPrivacyToken.urlAtHotel, newHotelPrivacyToken);

  RevalidateHotelPrivacyTokens();

  return guestPrivacyToken;
}

/**
 * Looks for the WebId privacy token created for the reservation represented by the ID passed.
 * Deletes the privacy token if found and informs the guest about it.
 * Anonymizes the target fields in the target dataset if required.
 */
export async function FindWebIdTokenAndDeleteIt(
  privacyTokens: (HotelPrivacyToken | null)[],
  reservationId: string,
  anonymize: boolean
): Promise<void> {
  return FindTokenAndDeleteIt(
    privacyTokens,
    reservationId,
    ReservationState.CONFIRMED,
    anonymize,
    ReservationFieldToRdfMap.owner
  );
}

/**
 * Looks for the email privacy token created for the reservation represented by the ID passed.
 * Deletes the privacy token if found and informs the guest about it.
 * Anonymizes the email in the reservation.
 */
export async function FindEmailTokenAndDeleteIt(
  privacyTokens: (HotelPrivacyToken | null)[],
  reservationId: string
): Promise<void> {
  return FindTokenAndDeleteIt(
    privacyTokens,
    reservationId,
    ReservationState.CONFIRMED,
    true,
    PersonFieldToRdfMap.email
  );
}

/**
 * Looks for the inbox privacy token created for the reservation represented by the ID passed.
 * Deletes the privacy token if found and informs the guest about it.
 * Anonymizes the target fields in the target dataset if required.
 */
export async function FindInboxTokenAndDeleteIt(
  privacyTokens: (HotelPrivacyToken | null)[],
  reservationId: string,
  anonymize: boolean
): Promise<void> {
  return FindTokenAndDeleteIt(
    privacyTokens,
    reservationId,
    ReservationState.CONFIRMED,
    anonymize,
    ReservationFieldToRdfMap.inbox
  );
}

/**
 * Looks for the hotel profile privacy token created for the reservation represented by the ID passed.
 * Deletes the privacy token if found.
 */
export async function FindHotelProfileTokenAndDeleteIt(
  privacyTokens: (HotelPrivacyToken | null)[],
  reservationId: string
): Promise<void> {
  return FindTokenAndDeleteIt(
    privacyTokens,
    reservationId,
    ReservationState.ACTIVE,
    false
  );
}

/**
 * Looks for the hotel profile privacy token created for the reservation represented by the ID passed.
 * Deletes the privacy token if found and informs the guest about it.
 * Anonymizes the target fields in the target dataset if required.
 */
async function FindTokenAndDeleteIt(
  privacyTokens: (HotelPrivacyToken | null)[],
  reservationId: string,
  reservationState: ReservationState,
  anonymize: boolean,
  rdfFieldIncluded?: string
): Promise<void> {
  console.log("Finding privacy token to send notice of deletion");
  const reservationUrl = CreateReservationUrlFromReservationId(reservationId);
  const token = privacyTokens.find(
    (t) =>
      t &&
      t.reservation === reservationUrl &&
      t.forReservationState === reservationState &&
      (!rdfFieldIncluded || t.fieldList.includes(rdfFieldIncluded))
  );

  if (!token) {
    ShowWarningSnackbar(
      "The sought token was not found. There's no need to delete anything."
    );
    return;
  }

  console.log("Sought token found.");
  if (anonymize) {
    //We need to supply the inbox separately, because when we're deleting the inbox token itself, we would anonymize that
    await AnonymizeFieldsAndDeleteToken(token, token.guestInbox);
  } else {
    await DeletePrivacyToken(token);
  }
}

/**
 * Anonymizes the inbox field in the privacy token deletion notification and saves the updated dataset to the Pod.
 */
export async function AnonymizeInboxInNotification(
  dataset: SolidDataset
): Promise<void> {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  let deletionThing = GetThing(dataset, "privacyTokenDeletion");
  if (!deletionThing) {
    throw new Error("Deletion thing is null");
  }

  deletionThing = setStringNoLocale(
    deletionThing,
    PrivacyDeletionToRdfMap.guestInboxUrl,
    "Anonymized"
  );
  const updatedDataSet = setThing(dataset, deletionThing);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

//TODO the method never return false
/**
 * A case by case study of the occasions when a privacy token is required to be deleted after it's past its expiration date.
 * This study is explained in detail in the thesis.
 * @returns A flag is we should go ahead with the deletion of the privacy token.
 */
export async function HandleIrregularTokenDeletion(
  privacyToken: HotelPrivacyToken
): Promise<boolean> {
  const reservation = await GetParsedReservationFromUrl(
    privacyToken.reservation
  );

  switch (privacyToken.forReservationState) {
    case ReservationState.REQUESTED:
    case ReservationState.CONFIRMED:
      switch (reservation.state) {
        case ReservationState.REQUESTED:
        case ReservationState.CONFIRMED:
          //the guest didn't check-in
          ConfirmCancellation(reservation);
          return true;

        case ReservationState.ACTIVE:
          if (privacyToken.expiry >= reservation.dateTo) {
            //the guest didn't check-out when they needed to
            //we force check-out
            ForceCheckout(reservation);
          } else {
            HandleCaseWhenAutoDeletionFailed(privacyToken);
          }
          return true;

        case ReservationState.PAST:
        case ReservationState.CANCELLED:
          HandleCaseWhenAutoDeletionFailed(privacyToken);
          return true;

        default:
          throw new Error(
            `Reservation state ${reservation.state} is unrecognized when handling irregular token deletions.`
          );
      }

    case ReservationState.ACTIVE:
      //this means the local profile
      switch (reservation.state) {
        case ReservationState.REQUESTED:
        case ReservationState.CONFIRMED:
          //something seriously went wrong
          throw new Error(
            "Privacy tokens were created for active state but the reservation state didn't get moved to active."
          );

        case ReservationState.ACTIVE:
          //the guest didn't check-out when they needed to, we force check-out
          ForceCheckout(reservation);
          return true;

        case ReservationState.PAST:
          HandleCaseWhenAutoDeletionFailed(privacyToken);
          return true;

        case ReservationState.CANCELLED:
          throw new Error(
            `The reservation ${reservation.id} was cancelled, after being active?`
          );

        default:
          throw new Error(
            `Reservation state ${reservation.state} is unrecognized when handling irregular token deletions.`
          );
      }

    case ReservationState.PAST:
      //this means the data protection profile
      switch (reservation.state) {
        case ReservationState.REQUESTED:
        case ReservationState.CONFIRMED:
        case ReservationState.ACTIVE:
          //something seriously went wrong
          throw new Error(
            "Privacy tokens were created for past state but the reservation state didn't get moved to past."
          );

        case ReservationState.PAST:
          return false;

        case ReservationState.CANCELLED:
          throw new Error(
            `Privacy tokens were created for past state, but the reservation ${reservation.id} was cancelled?`
          );

        default:
          throw new Error(
            `Reservation state ${reservation.state} is unrecognized when handling irregular token deletions.`
          );
      }

    default:
      throw new Error(
        `Privacy token for reservation state ${privacyToken.forReservationState} is unrecognized when handling irregular token deletions.`
      );
  }
}

/**
 * The guest didn't check-out in the timeframe provided for such.
 * We trigger the activity and force them to check-out.
 */
function ForceCheckout(reservation: ReservationAtHotel): void {
  const reservationId = reservation.id;
  const inbox = reservation.inbox;
  if (!reservationId || !inbox) {
    throw new Error(
      "Reservation ID or inbox is null while trying to force checkout during irregular privacy token deletion handling"
    );
  }

  //TODO this doesn't set the reservationState value I think, because the snackbar doesn't do that
  ShowCustomSnackbar((key) => (
    <CheckoutProgressSnackbar
      snackbarKey={key}
      reservationId={reservationId}
      reservationOwner={reservation.owner}
      replyInbox={inbox}
    />
  ));
}

/**
 * Something went wrong (or there was a manual intervention) and a privacy token wasn't deleted when it should have been.
 * Throws an error explaining the issue.
 */
function HandleCaseWhenAutoDeletionFailed(
  privacyToken: HotelPrivacyToken
): void {
  throw new Error(
    `Auto deletion failed for a privacy token and that was now requested to be deleted. However, there may be some side effects, so manual cleanup is needed: ${privacyToken}`
  );
}
