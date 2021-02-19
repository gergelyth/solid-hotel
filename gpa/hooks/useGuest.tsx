import {
  getDatetime,
  getInteger,
  getStringNoLocale,
} from "@inrupt/solid-client";
import useSWR from "swr";
import { Guest } from "../types/Guest";
import { GetProfile, SolidProfile } from "../util/solid";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";

function ConvertToGuest(solidProfile: SolidProfile | null): Guest | undefined {
  if (!solidProfile?.profile) {
    return undefined;
  }

  const profile = solidProfile.profile;

  const idDocument = {
    idDocumentType:
      getInteger(profile, personFieldToRdfMap.idDocumentType) ?? 0,
    idDocumentNumber:
      getStringNoLocale(profile, personFieldToRdfMap.idDocumentNumber) ??
      "<No ID document number>",
    idDocumentExpiry:
      // TODO: change default value here
      getDatetime(profile, personFieldToRdfMap.idDocumentExpiry) ?? new Date(),
  };

  const guest = {
    webId: solidProfile.profileAddress,
    firstName:
      getStringNoLocale(profile, personFieldToRdfMap.firstName) ??
      "<No firstname>",
    lastName:
      getStringNoLocale(profile, personFieldToRdfMap.lastName) ??
      "<No lastname>",
    nationality: getStringNoLocale(profile, personFieldToRdfMap.nationality),
    idDocument: idDocument,
    email: getStringNoLocale(profile, personFieldToRdfMap.email),
    phoneNumber:
      getStringNoLocale(profile, personFieldToRdfMap.phoneNumber) ??
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

  const { data, error } = useSWR("guest", fetcher);

  return {
    guest: data,
    isLoading: !error && !data,
    isError: error,
  };
}
