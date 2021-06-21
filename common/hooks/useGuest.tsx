import { getLiteral } from "@inrupt/solid-client";
import useSWR, { mutate } from "swr";
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

function GetFieldValues(
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
  rdfNames: string[] | undefined,
  webId: string | undefined = undefined
): {
  guestFields: Field[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<Field[] | undefined> => {
    const profile = webId ? GetProfileOf(webId) : GetProfile();
    return profile.then((solidProfile) =>
      GetFieldValues(solidProfile, rdfNames)
    );
  };

  const { data, error } = useSWR(() => CreateSwrKey(rdfNames, webId), fetcher);

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
