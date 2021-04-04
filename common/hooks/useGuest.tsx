import { getLiteral } from "@inrupt/solid-client";
import useSWR, { mutate } from "swr";
import { Field } from "../types/Field";
import { RdfNameToFieldMap } from "../util/fields";
import { GetProfile, SolidProfile } from "../util/solid";

function CreateSwrKey(rdfNames: string[] | undefined): string[] | null {
  const swrKey = "guest";
  return rdfNames ? [swrKey, rdfNames.join()] : null;
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
  rdfNames: string[] | undefined
): {
  guestFields: Field[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (): Promise<Field[] | undefined> => {
    return GetProfile().then((solidProfile) =>
      GetFieldValues(solidProfile, rdfNames)
    );
  };

  const { data, error } = useSWR(() => CreateSwrKey(rdfNames), fetcher);

  return {
    guestFields: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function RevalidateGuest(rdfNames: string[] | undefined): void {
  mutate(CreateSwrKey(rdfNames));
}

export function TriggerRefetchGuest(
  rdfNames: string[] | undefined,
  newFieldList: Field[]
): void {
  mutate(CreateSwrKey(rdfNames), newFieldList, false);
}
