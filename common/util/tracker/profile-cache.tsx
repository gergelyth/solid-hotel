import { Field } from "../../types/Field";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { GetProfileOf } from "../solid_profile";
import { ProfileUpdate } from "./trackerSendChange";

export const ProfileCache: { [url: string]: Field[] } = {};

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

export async function CacheProfileFields(
  profileUrl: string,
  fields: Field[]
): Promise<void> {
  ProfileCache[profileUrl] = fields.map((x) => ({ ...x }));
}

export function DeleteFromCache(profileUrl: string): void {
  delete ProfileCache[profileUrl];
}
