import {
  getDatetime,
  getInteger,
  getStringNoLocale,
  getStringNoLocaleAll,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { mutate } from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { PrivacyToken } from "../types/PrivacyToken";
import { GetThing } from "../util/solid";
import { PrivacyTokenToRdfMap } from "../vocabularies/notificationpayloads/rdfPrivacy";
import { FetchItems } from "./util/listThenItemsFetcher";

const hotelSwrKey = "hotelPrivacy";
const guestSwrKey = "guestPrivacy";

/**
 * Parses the common properties of the two types of privacy tokens.
 * @returns The common properties of privacy tokens.
 */
function ConvertToPrivacyToken(privacyThing: Thing): PrivacyToken {
  //TODO handle null values
  const token = {
    fieldList: getStringNoLocaleAll(
      privacyThing,
      PrivacyTokenToRdfMap.fieldList
    ),
    reason: getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.reason) ?? "",
    forReservationState:
      getInteger(privacyThing, PrivacyTokenToRdfMap.forReservationState) ?? 0,
    expiry:
      getDatetime(privacyThing, PrivacyTokenToRdfMap.expiry) ?? new Date(),
    urlAtHotel: getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.url),
  };

  return token;
}

/**
 * Parses the hotel privacy token dataset.
 * Hotel privacy token specific properties are parsed here, common property parsing is delegated to the shared method.
 * @returns The hotel privacy token or null (of there's an issue with the dataset).
 */
export function ConvertToHotelPrivacyToken(
  dataset: SolidDataset
): HotelPrivacyToken | null {
  const privacyThing = GetThing(dataset, "privacy");
  if (!privacyThing) {
    return null;
  }

  const privacyToken = ConvertToPrivacyToken(privacyThing);

  //TODO handle null values
  const hotelPrivacytoken = {
    ...privacyToken,
    datasetUrlTarget:
      getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.datasetUrlTarget) ??
      "",
    guestInbox:
      getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.guestInbox) ??
      undefined,
    reservation:
      getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.reservation) ?? "",
  };

  return hotelPrivacytoken;
}

/**
 * Parses the guest privacy token dataset.
 * Guest privacy token specific properties are parsed here, common property parsing is delegated to the shared method.
 * @returns The guest privacy token or null (of there's an issue with the dataset).
 */
export function ConvertToGuestPrivacyToken(
  dataset: SolidDataset,
  url: string
): GuestPrivacyToken | null {
  const privacyThing = GetThing(dataset, "privacy");
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
        PrivacyTokenToRdfMap.hotelInboxForDeletion
      ) ?? "",
    hotel: getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.hotel) ?? "",
    urlAtGuest: url,
    reservation:
      getStringNoLocale(privacyThing, PrivacyTokenToRdfMap.reservation) ??
      undefined,
  };

  return guestPrivacytoken;
}

/**
 * Fetches the hotel privacy tokens contained in the inbox whose URL is passed to the function.
 * If no URL is passed, the SWR hook doesn't get called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The hotel privacy tokens and further flags representing the state of the fetch (isLoading, isError).
 */
export function useHotelPrivacyTokens(privacyInbox: string | null): {
  items: (HotelPrivacyToken | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetchResult = FetchItems<HotelPrivacyToken>(
    hotelSwrKey,
    privacyInbox,
    ConvertToHotelPrivacyToken
  );

  if (fetchResult.isValidating) {
    AddLoadingIndicator(hotelSwrKey);
  } else {
    RemoveLoadingIndicator(hotelSwrKey);
  }

  return fetchResult;
}

/**
 * Triggers a refetch of hotel privacy tokens.
 */
export function RevalidateHotelPrivacyTokens(): void {
  mutate(hotelSwrKey);
}

/**
 * Fetches the guest privacy tokens contained in the inbox whose URL is passed to the function.
 * If no URL is passed, the SWR hook doesn't get called.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The guest privacy tokens and further flags representing the state of the fetch (isLoading, isError).
 */
export function useGuestPrivacyTokens(privacyInbox: string | null): {
  items: (GuestPrivacyToken | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetchResult = FetchItems<GuestPrivacyToken>(
    guestSwrKey,
    privacyInbox,
    ConvertToGuestPrivacyToken
  );

  if (fetchResult.isValidating) {
    AddLoadingIndicator(guestSwrKey);
  } else {
    RemoveLoadingIndicator(guestSwrKey);
  }

  return fetchResult;
}

/**
 * Triggers a refetch of guest privacy tokens.
 */
export function RevalidateGuestPrivacyTokens(): void {
  mutate(guestSwrKey);
}
