import { getLiteral, getUrl } from "@inrupt/solid-client";
import useSWR, { mutate } from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { Field } from "../types/Field";
import { RdfNameToFieldMap } from "../util/fields";
import { GetProfile, GetProfileOf, SolidProfile } from "../util/solidProfile";

/**
 * Creates the SWR key distinguishing between possible cases to make sure one case's cache is not used for another case's retrieval.
 * @returns The SWR key fit for the specific case.
 */
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

/**
 * Retrieves the appropriate supported field definitions from {@link RdfNameToFieldMap} and passes in the value retrieved from the guest profile.
 * @returns An array of fields with the values substituted or undefined if a passed argument is incorrect.
 */
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
    field.fieldValue = literal?.value ?? getUrl(profile, rdfName) ?? undefined;

    fields.push(field);
  });

  return fields;
}

/**
 * Fetches the profile of a guest and returns the required fields given by the RDF names passed.
 * To construct the guest fields, the hook uses {@link RdfNameToFieldMap} and substitutes the values.
 * If no RDF names are passed, the SWR hook doesn't get called.
 * If the WebId doesn't get passed, the profile of the default session is retrieved and processed.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The guest fields and further flags representing the state of the fetch (isLoading, isError).
 */
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

/**
 * Triggers a refetch of the guest data.
 */
export function RevalidateGuest(
  rdfNames: string[] | undefined,
  webId: string | undefined = undefined
): void {
  mutate(CreateSwrKey(rdfNames, webId));
}

/**
 * Puts the supplied values into the SWR cache quickly to make the change feel immediate.
 */
export function TriggerRefetchGuest(
  rdfNames: string[] | undefined,
  newFieldList: Field[],
  webId: string | undefined = undefined
): void {
  mutate(CreateSwrKey(rdfNames, webId), newFieldList, false);
}
