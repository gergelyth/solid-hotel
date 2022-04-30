import {
  deleteSolidDataset,
  getSolidDataset,
  getSourceUrl,
  getThingAll,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import {
  PrivacyTokensInboxUrl,
  PrivacyTokensUrl,
} from "../../common/consts/solidIdentifiers";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../../common/types/HotelPrivacyToken";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { CreateHotelPrivacyTokenDataset } from "../../common/util/datasetFactory";
import { GetSession } from "../../common/util/solid";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";

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
  privacyToken: HotelPrivacyToken
): Promise<void> {
  if (!privacyToken.datasetUrlTarget) {
    throw new Error("Privacy token target URL is null");
  }

  const session = GetSession();
  AnonymizeFields(privacyToken.datasetUrlTarget, privacyToken.fieldList).then(
    () => {
      if (!privacyToken.urlAtHotel) {
        throw new Error("Privacy token URL is null. Cannot process/delete");
      }
      deleteSolidDataset(privacyToken.urlAtHotel, { fetch: session.fetch });
    }
  );
}

export async function CreateReservationPrivacyToken(
  reservationUrl: string,
  guestInbox: string,
  reservation: ReservationAtHotel
): Promise<GuestPrivacyToken[]> {
  const webIdToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [reservationFieldToRdfMap.owner],
    reservation.dateFrom,
    "Basic information for a confirmed reservation",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  const inboxToken = SaveHotelAndCreateGuestPrivacyToken(
    reservationUrl,
    [reservationFieldToRdfMap.inbox],
    reservation.dateTo,
    "Reservation inbox used for communication with the hotel",
    ReservationState.CONFIRMED,
    guestInbox,
    reservationUrl
  );

  return Promise.all([webIdToken, inboxToken]);
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
  };
  guestPrivacyToken.urlAtHotel = getSourceUrl(savedDataset);

  return guestPrivacyToken;
}
