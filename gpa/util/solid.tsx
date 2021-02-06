import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setStringNoLocale,
  setThing,
  SolidDataset,
  Thing,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { NotFoundError } from "./errors";

type SolidProfile = {
  profileAddress: string;
  profile: Thing | null;
  dataSet: SolidDataset | null;
};

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = getDefaultSession();
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

export async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = getDefaultSession();
  await session.login({
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
  });
}

export async function SolidLogout(): Promise<void> {
  const session = GetSession();
  if (session == null) {
    return;
  }
  await session.logout();
}

function GetSession(): Session {
  return getDefaultSession();
}

function GetPodOfDefaultSession(
  session: Session = GetSession()
): string | null {
  const webId = session.info.webId;
  if (!webId) {
    return null;
  }

  return new URL(webId)?.hostname;
}

export async function GetDataSet(
  url: string,
  session: Session = GetSession()
): Promise<SolidDataset & WithResourceInfo> {
  const dataSet = await getSolidDataset(url, {
    fetch: session.fetch,
  });

  if (!dataSet) {
    throw new NotFoundError(`Dataset at ${url} not found.`);
  }

  return dataSet;
}

async function GetProfile(
  session: Session = GetSession()
): Promise<SolidProfile | null> {
  if (!session.info.webId) {
    console.log("WebID null");
    return null;
  }

  const solidPodAddress = GetPodOfDefaultSession(session);
  if (!solidPodAddress) {
    return null;
  }

  const profileAddress = solidPodAddress + "/profile/card";
  const dataSet = await getSolidDataset(profileAddress, {
    fetch: session.fetch,
  });

  const profile = getThing(dataSet, session.info.webId);

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

export async function SetField(field: string, value: string): Promise<void> {
  const session = getDefaultSession();
  const solidProfile = await GetProfile();

  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = setStringNoLocale(solidProfile.profile, field, value);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await saveSolidDatasetAt(solidProfile.profileAddress, updatedDataSet, {
    fetch: session.fetch,
  });
}
