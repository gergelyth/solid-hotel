import {
  getDatetime,
  getInteger,
  getStringNoLocale,
  getStringNoLocaleAll,
  getThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { mutate } from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { LocalNodeSkolemPrefix } from "../consts/solidIdentifiers";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { PrivacyToken } from "../types/PrivacyToken";
import { privacyTokenToRdfMap } from "../vocabularies/notification_payloads/rdf_privacy";
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

/**
 * Parses the hotel privacy token dataset.
 * Hotel privacy token specific properties are parsed here, common property parsing is delegated to the shared method.
 * @returns The hotel privacy token or null (of there's an issue with the dataset).
 */
export function ConvertToHotelPrivacyToken(
  dataset: SolidDataset
): HotelPrivacyToken | null {
  const privacyThing = getThing(dataset, LocalNodeSkolemPrefix + "privacy");
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

/**
 * Parses the guest privacy token dataset.
 * Guest privacy token specific properties are parsed here, common property parsing is delegated to the shared method.
 * @returns The guest privacy token or null (of there's an issue with the dataset).
 */
export function ConvertToGuestPrivacyToken(
  dataset: SolidDataset,
  url: string
): GuestPrivacyToken | null {
  const privacyThing = getThing(dataset, LocalNodeSkolemPrefix + "privacy");
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
    reservation:
      getStringNoLocale(privacyThing, privacyTokenToRdfMap.reservation) ??
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
