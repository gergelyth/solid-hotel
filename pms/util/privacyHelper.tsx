import {
  deleteSolidDataset,
  getSolidDataset,
  getSourceUrl,
  getThing,
  getThingAll,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
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
import { GetStartOfNextDay } from "../../common/util/helpers";
import { GetSession } from "../../common/util/solid";
import { GetParsedReservationFromUrl } from "../../common/util/solid_reservations";
import { CreateReservationUrlFromReservationId } from "../../common/util/urlParser";
import { privacyDeletionToRdfMap } from "../../common/vocabularies/notification_payloads/rdf_privacyDeletion";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";
import CheckoutProgressSnackbar from "../components/checkout/checkout-progress-snackbar";
import { ConfirmCancellation } from "../components/reservations/reservation-element";
import { SendPrivacyTokenDeletionNotice } from "./outgoingCommunications";

async function AnonymizeFields(
  datasetUrlTarget: string,
  fieldList: string[]
): Promise<void> {
  const session = GetSession();

  let targetDataset = await getSolidDataset(datasetUrlTarget, {
    fetch: session.fetch,
  });

  const containedThings = getThingAll(targetDataset);
  if (containedThings.length !== 1) {
    throw new Error("Only 1 contained thing is supported at the moment");
  }

  let thing = containedThings[0];
  fieldList.forEach((field) => {
    thing = setStringNoLocale(thing, field, "Anonymized");
  });

  targetDataset = setThing(targetDataset, thing);
  return new Promise(() =>
    saveSolidDatasetAt(datasetUrlTarget, targetDataset, {
      fetch: session.fetch,
    })
  );
}

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

async function DeletePrivacyToken(
  privacyToken: HotelPrivacyToken,
  guestInboxUrl?: string
): Promise<void> {
  if (!privacyToken.urlAtHotel) {
    throw new Error("Privacy token URL is null. Cannot process/delete");
  }
  const session = GetSession();
  await deleteSolidDataset(privacyToken.urlAtHotel, { fetch: session.fetch });
  await SendPrivacyTokenDeletionNotice(privacyToken, guestInboxUrl);
  RevalidateHotelPrivacyTokens();
}

export async function CreateReservationPrivacyToken(
  reservationUrl: string,
  guestInbox: string,
  reservation: ReservationAtHotel
): Promise<GuestPrivacyToken[]> {
  const webIdToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [reservationFieldToRdfMap.owner],
    GetStartOfNextDay(reservation.dateFrom),
    "Basic information for a confirmed reservation",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  const inboxToken = CreateInboxPrivacyToken(
    reservationUrl,
    guestInbox,
    reservation
  );

  return Promise.all([webIdToken, inboxToken]);
}

export async function CreateInboxPrivacyToken(
  reservationUrl: string,
  guestInbox: string,
  reservation: ReservationAtHotel
): Promise<GuestPrivacyToken> {
  const inboxToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [reservationFieldToRdfMap.inbox],
    GetStartOfNextDay(reservation.dateTo),
    "Reservation inbox used for communication with the hotel",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  return inboxToken;
}

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
    "Local profile copy made for an active reservation.",
    ReservationState.ACTIVE,
    guestInbox,
    reservationUrl
  );
}

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
    "Local profile copy made for preserving data protection information.",
    ReservationState.PAST,
    //we're not saving the inbox anymore in the privacy token, because we don't need it
    //the hotel will no longer manipulate with this on its own volition
    undefined,
    reservationUrl
  );
}

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
  const savedDataset = await saveSolidDatasetInContainer(
    PrivacyTokensUrl,
    hotelPrivacyTokenDataset,
    { fetch: session.fetch }
  );

  const guestPrivacyToken: GuestPrivacyToken = {
    ...privacyToken,
    hotelInboxForDeletion: PrivacyTokensInboxUrl,
    hotel: hotelWebId,
    urlAtGuest: undefined,
    reservation: undefined,
  };
  guestPrivacyToken.urlAtHotel = getSourceUrl(savedDataset);
  RevalidateHotelPrivacyTokens();

  return guestPrivacyToken;
}

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
    reservationFieldToRdfMap.owner
  );
}

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
    reservationFieldToRdfMap.inbox
  );
}

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

export async function AnonymizeInboxInNotification(
  dataset: SolidDataset,
  session: Session = GetSession()
): Promise<void> {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  let deletionThing = getThing(dataset, datasetUrl + "#privacyTokenDeletion");
  if (!deletionThing) {
    throw new Error("Deletion thing is null");
  }

  deletionThing = setStringNoLocale(
    deletionThing,
    privacyDeletionToRdfMap.guestInboxUrl,
    "Anonymized"
  );
  const updatedDataSet = setThing(dataset, deletionThing);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}

//TODO There's a case by case study for this in my notebook. Prepare it nicely and put it somewhere
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
      key={key}
      reservationId={reservationId}
      reservationOwner={reservation.owner}
      replyInbox={inbox}
    />
  ));
}

function HandleCaseWhenAutoDeletionFailed(
  privacyToken: HotelPrivacyToken
): void {
  throw new Error(
    `Auto deletion failed for a privacy token and that was now requested to be deleted. However, there may be some side effects, so manual cleanup is needed: ${privacyToken}`
  );
}
