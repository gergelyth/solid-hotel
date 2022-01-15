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
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { CreatePrivacyTokenDataset } from "../../common/util/datasetFactory";
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
  privacyToken: PrivacyToken
): Promise<void> {
  if (!privacyToken.datasetUrlTarget) {
    throw new Error("Privacy token target URL is null");
  }

  const session = GetSession();
  AnonymizeFields(privacyToken.datasetUrlTarget, privacyToken.fieldList).then(
    () => {
      if (!privacyToken.url) {
        throw new Error("Privacy token URL is null. Cannot process/delete");
      }
      deleteSolidDataset(privacyToken.url, { fetch: session.fetch });
    }
  );
}

export async function CreateReservationPrivacyToken(
  datasetUrlTarget: string,
  reservation: ReservationAtHotel
): Promise<PrivacyToken> {
  const session = GetSession();

  const hotelWebId = session.info.webId;
  if (!hotelWebId) {
    throw new Error("Hotel not logged in. This should never happen");
  }

  const privacyToken: PrivacyToken = {
    url: null,
    hotelInboxForDeletion: PrivacyTokensInboxUrl,
    datasetUrlTarget: datasetUrlTarget,
    hotel: hotelWebId,
    guest: reservation.owner,
    fieldList: [reservationFieldToRdfMap.inbox, reservationFieldToRdfMap.owner],
    reason: "Basic information for a confirmed reservation",
    forReservationState: ReservationState.CONFIRMED,
    expiry: reservation.dateTo,
  };

  const privacyTokenDataset = CreatePrivacyTokenDataset(privacyToken);
  const savedDataset = await saveSolidDatasetInContainer(
    PrivacyTokensUrl,
    privacyTokenDataset,
    { fetch: session.fetch }
  );

  privacyToken.url = getSourceUrl(savedDataset);
  return privacyToken;
}

export async function CreateActiveProfilePrivacyToken(
  datasetUrlTarget: string,
  guestWebId: string,
  fields: string[],
  expiryDate: Date
): Promise<PrivacyToken> {
  return CreateProfilePrivacyToken(
    datasetUrlTarget,
    guestWebId,
    fields,
    expiryDate,
    "Local profile copy made for an active reservation.",
    ReservationState.ACTIVE
  );
}

export async function CreateDataProtectionProfilePrivacyToken(
  datasetUrlTarget: string,
  guestWebId: string,
  fields: string[],
  expiryDate: Date
): Promise<PrivacyToken> {
  return CreateProfilePrivacyToken(
    datasetUrlTarget,
    guestWebId,
    fields,
    expiryDate,
    "Local profile copy made for preserving data protection information.",
    ReservationState.PAST
  );
}

async function CreateProfilePrivacyToken(
  datasetUrlTarget: string,
  guestWebId: string,
  fields: string[],
  expiryDate: Date,
  reason: string,
  forReservationState: ReservationState
): Promise<PrivacyToken> {
  const session = GetSession();

  const hotelWebId = session.info.webId;
  if (!hotelWebId) {
    throw new Error("Hotel not logged in. This should never happen");
  }

  const privacyToken: PrivacyToken = {
    url: null,
    hotelInboxForDeletion: PrivacyTokensInboxUrl,
    datasetUrlTarget: datasetUrlTarget,
    hotel: hotelWebId,
    guest: guestWebId,
    fieldList: fields,
    reason: reason,
    forReservationState: forReservationState,
    expiry: expiryDate,
  };

  const privacyTokenDataset = CreatePrivacyTokenDataset(privacyToken);
  await saveSolidDatasetInContainer(PrivacyTokensUrl, privacyTokenDataset, {
    fetch: session.fetch,
  });

  return privacyToken;
}
