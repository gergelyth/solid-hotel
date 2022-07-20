import {
  getPropertyAll,
  getStringNoLocale,
  getTerm,
  getThing,
  removeAll,
  setStringNoLocale,
  setTerm,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { NotFoundError } from "./errors";
import { GetDataSet, GetSession } from "./solid";
import { SafeSaveDatasetAt } from "./solidWrapper";

/** A helper type which contains the profile WebId, the Solid Thing and the dataset. */
export type SolidProfile = {
  profileAddress: string;
  profile: Thing | null;
  //TODO we probably don't need these
  dataSet: SolidDataset | null;
};

/**
 * Retrieves the profile of the currently logged in user.
 * @returns The profile information or null if currently no user is logged in.
 */
export async function GetProfile(
  session: Session = GetSession()
): Promise<SolidProfile | null> {
  if (!session.info.webId) {
    console.log("WebID null");
    return null;
  }

  return GetProfileOf(session.info.webId);
}

/**
 * Retrieves the profile of the user represented by the supplied WebId.
 * @returns The profile information or null if no WebId is supplied.
 */
export async function GetProfileOf(
  webId: string | undefined
): Promise<SolidProfile | null> {
  if (!webId) {
    return null;
  }

  const profileAddress = webId.split("#")[0];
  const dataSet = await GetDataSet(profileAddress);

  const profile = getThing(dataSet, webId);

  return { profileAddress, profile, dataSet };
}

/**
 * Retrieves the profile of the currently logged in user and parses the value of the requested field.
 * @returns The string value of the requested field.
 */
export async function GetField(field: string): Promise<string> {
  const solidProfile = await GetProfile();

  if (!solidProfile || !solidProfile.profile) {
    throw new NotFoundError("Profile not found.");
  }

  const value = getStringNoLocale(solidProfile.profile, field);
  if (!value) {
    throw new NotFoundError("Field not found in the Solid Pod.");
  }

  return value;
}

/**
 * Retrieves the profile of the user represented by WebId passed in or the currently logged in user if no WebId was specified.
 * Sets the value of the field to the one supplied.
 */
export async function SetField(
  field: string,
  value: string,
  webId?: string
): Promise<void> {
  const solidProfile = webId ? await GetProfileOf(webId) : await GetProfile();

  return SetFieldInSolidProfile(solidProfile, field, value);
}

/**
 * Retrieves the profile of the user represented by WebId passed in or the currently logged in user if no WebId was specified.
 * Sets the values of multiple fields (given by RDF names) to the values specified.
 */
export async function SetMultipleFieldsInProfile(
  profileUrl: string,
  newFields: {
    [rdfName: string]: string;
  }
): Promise<void> {
  const solidProfile = await GetProfileOf(profileUrl);

  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  let updatedProfile = solidProfile.profile;
  Object.keys(newFields).forEach((rdfName: string) => {
    updatedProfile = setStringNoLocale(
      updatedProfile,
      rdfName,
      newFields[rdfName]
    );
  });

  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);
  await SafeSaveDatasetAt(solidProfile.profileAddress, updatedDataSet);
}

/**
 * Takes the profile information and modifies the value of the field requested.
 * Saves the dataset after.
 */
export async function SetFieldInSolidProfile(
  solidProfile: SolidProfile | null,
  field: string,
  value: string
): Promise<void> {
  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = setStringNoLocale(solidProfile.profile, field, value);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await SafeSaveDatasetAt(solidProfile.profileAddress, updatedDataSet);
}

/**
 * Retrieves the profile of the user represented by WebId passed in or the currently logged in user if no WebId was specified.
 * Removes the field requested (given by RDF names) from the profile.
 */
export async function RemoveField(
  field: string,
  webId?: string
): Promise<void> {
  const solidProfile = webId ? await GetProfileOf(webId) : await GetProfile();

  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = removeAll(solidProfile.profile, field);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await SafeSaveDatasetAt(solidProfile.profileAddress, updatedDataSet);
}

/**
 * Iterates all fields contained in the Solid Thing supplied and sets them in the profile of the currently logged in user.
 * Updates the user profile in the Solid Pod.
 */
export async function SaveProfileThingToPod(
  profileThing: Thing
): Promise<void> {
  const properties = getPropertyAll(profileThing);

  const userProfile = await GetProfile();
  if (!userProfile) {
    throw new Error("User profile undefined");
  }

  let userProfileThing = userProfile.profile;

  properties.forEach((property) => {
    const term = getTerm(profileThing, property);
    if (!term) {
      throw new Error(`Property ${property} has no term`);
    }

    if (!userProfileThing) {
      throw new Error("UserProfileThing is undefined");
    }

    userProfileThing = setTerm(userProfileThing, property, term);
  });

  if (!userProfile.dataSet || !userProfileThing) {
    throw new Error("User profile dataset or user profile Thing is null");
  }
  const updatedDataSet = setThing(userProfile.dataSet, userProfileThing);

  await SafeSaveDatasetAt(userProfile.profileAddress, updatedDataSet);
}
