import {
  getDatetime,
  getInteger,
  getStringNoLocale,
} from "@inrupt/solid-client";
import useSWR from "swr";
import { Guest } from "../types/Guest";
import { GetProfile, SolidProfile } from "../util/solid";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";

const swrKey = "guest";

function ConvertToGuest(solidProfile: SolidProfile | null): Guest | undefined {
  if (!solidProfile?.profile) {
    return undefined;
  }

  const profile = solidProfile.profile;

  const idDocument = {
    idDocumentType:
      getInteger(profile, personFieldToRdfMap["ID document type"]) ?? 0,
    idDocumentNumber:
      getStringNoLocale(profile, personFieldToRdfMap["ID document number"]) ??
      "<No ID document number>",
    idDocumentExpiry:
      // TODO: change default value here
      getDatetime(profile, personFieldToRdfMap["ID document expiry"]) ??
      new Date(),
  };

  const guest = {
    webId: solidProfile.profileAddress,
    firstName:
      getStringNoLocale(profile, personFieldToRdfMap["First name"]) ??
      "<No firstname>",
    lastName:
      getStringNoLocale(profile, personFieldToRdfMap["Last name"]) ??
      "<No lastname>",
    nationality: getStringNoLocale(profile, personFieldToRdfMap["Nationality"]),
    idDocument: idDocument,
    email: getStringNoLocale(profile, personFieldToRdfMap["Email"]),
    phoneNumber:
      getStringNoLocale(profile, personFieldToRdfMap["Phone number"]) ??
      "<No phone number>",
  };

  return guest;
}

export function useGuest(): {
  guest: Guest | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<Guest | undefined> => {
    return GetProfile().then((solidProfile) => ConvertToGuest(solidProfile));
  };

  const { data, error } = useSWR(swrKey, fetcher);

  return {
    guest: data,
    isLoading: !error && !data,
    isError: error,
  };
}
