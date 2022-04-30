import {
  getDatetime,
  getInteger,
  getStringNoLocale,
  getStringNoLocaleAll,
  getThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { PrivacyToken } from "../types/PrivacyToken";
import { privacyTokenToRdfMap } from "../vocabularies/notification_payloads/rdf_privacy";
import { FetchItems } from "./util/listThenItemsFetcher";

const hotelSwrKey = "hotelPrivacy";
const guestSwrKey = "guestPrivacy";

function ConvertToPrivacyToken(privacyThing: Thing): PrivacyToken {
  //TODO handle null values
  const token = {
    fieldList: getStringNoLocaleAll(
      privacyThing,
      privacyTokenToRdfMap.fieldList
    ),
    reason: getStringNoLocale(privacyThing, privacyTokenToRdfMap.reason) ?? "",
    forReservationState:
      getInteger(privacyThing, privacyTokenToRdfMap.forReservationState) ?? 0,
    expiry:
      getDatetime(privacyThing, privacyTokenToRdfMap.expiry) ?? new Date(),
    urlAtHotel: getStringNoLocale(privacyThing, privacyTokenToRdfMap.url),
  };

  return token;
}

export function ConvertToHotelPrivacyToken(
  dataset: SolidDataset,
  url: string
): HotelPrivacyToken | null {
  const privacyThing = getThing(dataset, url + "#privacy");
  if (!privacyThing) {
    return null;
  }

  const privacyToken = ConvertToPrivacyToken(privacyThing);

  //TODO handle null values
  const hotelPrivacytoken = {
    ...privacyToken,
    datasetUrlTarget:
      getStringNoLocale(privacyThing, privacyTokenToRdfMap.datasetUrlTarget) ??
      "",
    guestInbox:
      getStringNoLocale(privacyThing, privacyTokenToRdfMap.guestInbox) ??
      undefined,
    reservation:
      getStringNoLocale(privacyThing, privacyTokenToRdfMap.reservation) ?? "",
  };

  return hotelPrivacytoken;
}

export function ConvertToGuestPrivacyToken(
  dataset: SolidDataset,
  url: string
): GuestPrivacyToken | null {
  const privacyThing = getThing(dataset, url + "#privacy");
  if (!privacyThing) {
    return null;
  }

  const privacyToken = ConvertToPrivacyToken(privacyThing);

  //TODO handle null values
  const guestPrivacytoken = {
    ...privacyToken,
    hotelInboxForDeletion:
      getStringNoLocale(
        privacyThing,
        privacyTokenToRdfMap.hotelInboxForDeletion
      ) ?? "",
    hotel: getStringNoLocale(privacyThing, privacyTokenToRdfMap.hotel) ?? "",
    urlAtGuest: url,
  };

  return guestPrivacytoken;
}

export function useHotelPrivacyTokens(privacyInbox: string | null): {
  items: (HotelPrivacyToken | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return FetchItems<HotelPrivacyToken>(
    hotelSwrKey,
    privacyInbox,
    ConvertToHotelPrivacyToken
  );
}

export function useGuestPrivacyTokens(privacyInbox: string | null): {
  items: (GuestPrivacyToken | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return FetchItems<GuestPrivacyToken>(
    guestSwrKey,
    privacyInbox,
    ConvertToGuestPrivacyToken
  );
}
