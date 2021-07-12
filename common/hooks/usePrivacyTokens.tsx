import {
  getDatetime,
  getStringNoLocale,
  getStringNoLocaleAll,
  getThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { PrivacyToken } from "../types/PrivacyToken";
import { privacyTokenToRdfMap } from "../vocabularies/notification_payloads/rdf_privacy";
import { FetchItems } from "./util/listThenItemsFetcher";

const swrKey = "privacy";

export function ConvertToPrivacyToken(
  dataset: SolidDataset,
  url: string
): PrivacyToken | null {
  const privacyThing = getThing(dataset, url + "#privacy");
  if (!privacyThing) {
    return null;
  }

  //TODO handle null values
  const token = {
    url: url,
    hotel: getStringNoLocale(privacyThing, privacyTokenToRdfMap.hotel) ?? "",
    guest: getStringNoLocale(privacyThing, privacyTokenToRdfMap.guest) ?? "",
    fieldList: getStringNoLocaleAll(
      privacyThing,
      privacyTokenToRdfMap.fieldList
    ),
    reason: getStringNoLocale(privacyThing, privacyTokenToRdfMap.reason) ?? "",
    expiry:
      getDatetime(privacyThing, privacyTokenToRdfMap.expiry) ?? new Date(),
  };

  return token;
}

export function usePrivacyTokens(privacyInbox: string): {
  items: (PrivacyToken | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return FetchItems<PrivacyToken>(swrKey, privacyInbox, ConvertToPrivacyToken);
}
