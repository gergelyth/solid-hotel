import { getLiteral } from "@inrupt/solid-client";
import useSWR, { mutate } from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { Field } from "../types/Field";
import { RdfNameToFieldMap } from "../util/fields";
import { GetProfile, GetProfileOf, SolidProfile } from "../util/solid_profile";

function CreateSwrKey(
  rdfNames: string[] | undefined,
  webId: string | undefined
): string[] | null {
  const swrKey = "guest";
  const result = rdfNames ? [swrKey, rdfNames.join()] : null;
  if (result && webId) {
    result.push(webId);
  }
  return result;
}

export function GetGuestFieldValues(
  solidProfile: SolidProfile | null,
  rdfNames: string[] | undefined
): Field[] | undefined {
  if (!solidProfile?.profile || !rdfNames) {
    return undefined;
  }

  const profile = solidProfile.profile;

  const fields: Field[] = [];

  rdfNames.forEach((rdfName: string) => {
    const field = RdfNameToFieldMap[rdfName];
    if (!field) {
      throw new Error(`Field not supported: ${rdfName}`);
    }
    const literal = getLiteral(profile, rdfName);

    field.fieldValue = literal?.value;

    fields.push(field);
  });

  return fields;
}

export function useGuest(
  rdfNames?: string[],
  webId?: string
): {
  guestFields: Field[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<Field[] | undefined> => {
    const profile = webId ? GetProfileOf(webId) : GetProfile();
    return profile.then((solidProfile) =>
      GetGuestFieldValues(solidProfile, rdfNames)
    );
  };

  const { data, error, isValidating } = useSWR(
    () => CreateSwrKey(rdfNames, webId),
    fetcher
  );

  const swrKey = CreateSwrKey(rdfNames, webId);
  if (swrKey) {
    const swrKeyString = swrKey.join();
    if (isValidating) {
      AddLoadingIndicator(swrKeyString);
    } else {
      RemoveLoadingIndicator(swrKeyString);
    }
  }

  return {
    guestFields: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function RevalidateGuest(
  rdfNames: string[] | undefined,
  webId: string | undefined = undefined
): void {
  mutate(CreateSwrKey(rdfNames, webId));
}

export function TriggerRefetchGuest(
  rdfNames: string[] | undefined,
  newFieldList: Field[],
  webId: string | undefined = undefined
): void {
  mutate(CreateSwrKey(rdfNames, webId), newFieldList, false);
}
