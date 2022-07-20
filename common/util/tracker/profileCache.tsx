import { Field } from "../../types/Field";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { GetProfileOf } from "../solidProfile";
import { ProfileUpdate } from "../../components/profilesync/tracker-send-change";

/** A WebId to fields cache map, which is used to determine old values after new values are already in the user's Solid Pod. */
export const ProfileCache: { [url: string]: Field[] } = {};

/**
 * Adds a new entry into the profile cache by retrieving the fields from the user's Solid Pod which are assigned to the passed WebId.
 */
export async function CacheProfile(
  profileUrl: string,
  rdfFields: string[]
): Promise<void> {
  const profile = await GetProfileOf(profileUrl);
  const guestFields = GetGuestFieldValues(profile, rdfFields);

  if (!guestFields) {
    console.log(`Guest retrieval failed of ${profileUrl}`);
    return;
  }

  console.log(`Caching ${profileUrl} for fields [${rdfFields}]`);

  CacheProfileFields(profileUrl, guestFields);
}

/**
 * Sets the new values for the given fields in the cache assigned to the passed WebId.
 */
export function UpdateProfileInMemory(
  profileUrl: string,
  fieldOptions: ProfileUpdate
): void {
  const guestFields = ProfileCache[profileUrl];

  for (const field of guestFields) {
    const valueChange = fieldOptions[field.rdfName];
    if (!valueChange || !valueChange.status) {
      continue;
    }

    field.fieldValue = valueChange.newValue;
  }
}

/**
 * Adds a new entry into the profile cache with the passed fields.
 */
export async function CacheProfileFields(
  profileUrl: string,
  fields: Field[]
): Promise<void> {
  ProfileCache[profileUrl] = fields.map((x) => ({ ...x }));
}

/**
 * Deletes the WebId entry and its assigned fields from the cache.
 */
export function DeleteFromCache(profileUrl: string): void {
  delete ProfileCache[profileUrl];
}
