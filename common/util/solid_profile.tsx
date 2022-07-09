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
import { SafeSaveDatasetAt } from "./solid_wrapper";

export type SolidProfile = {
  profileAddress: string;
  profile: Thing | null;
  //TODO we probably don't need these
  dataSet: SolidDataset | null;
};

export async function GetProfile(
  session: Session = GetSession()
): Promise<SolidProfile | null> {
  if (!session.info.webId) {
    console.log("WebID null");
    return null;
  }

  return GetProfileOf(session.info.webId);
}

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

export async function SetField(
  field: string,
  value: string,
  webId?: string
): Promise<void> {
  const solidProfile = webId ? await GetProfileOf(webId) : await GetProfile();

  return SetFieldInSolidProfile(solidProfile, field, value);
}

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
