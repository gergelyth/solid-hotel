import { Field } from "../../types/Field";
import { GetGuestFieldValues } from "../../hooks/useGuest";
import { GetProfileOf } from "../solid_profile";

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

  ProfileCache[profileUrl] = guestFields.map((x) => ({ ...x }));
}
