import {
  addStringNoLocale,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = getDefaultSession();
  await session.handleIncomingRedirect(window.location.href);
  const isLoggedIn = session.info.isLoggedIn;
  return isLoggedIn;
}

export function GetSession(): Session {
  return getDefaultSession();
}

async function GetProfile(): Promise<Thing | null> {
  const session = GetSession();
  if (!session.info.webId) {
    console.log("WebID null");
    return null;
  }

  const dataSet = await getSolidDataset(
    "https://gergelyth.inrupt.net/profile/card",
    { fetch: session.fetch }
  );

  const profile = getThing(dataSet, session.info.webId);

  return profile;
}

export async function GetField(field: string): Promise<string | null> {
  const profile = await GetProfile();

  if (!profile) {
    console.log("Profile null");
    return null;
  }

  return getStringNoLocale(profile, field);
}

export async function SetField(field: string, value: string): Promise<void> {
  const session = GetSession();
  if (!session.info.webId) {
    console.log("WebID null");
    return;
  }

  const dataSet = await getSolidDataset(
    "https://gergelyth.inrupt.net/profile/card",
    { fetch: session.fetch }
  );

  // session.info.webId = https://gergelyth.inrupt.net/profile/card#me
  const profile = getThing(dataSet, session.info.webId);

  if (!profile) {
    console.log("Profile null");
    return;
  }

  const updatedProfile = addStringNoLocale(profile, field, value);
  const updatedDataSet = setThing(dataSet, updatedProfile);
  const savedResource = await saveSolidDatasetAt(
    "https://gergelyth.inrupt.net/profile/card",
    updatedDataSet,
    { fetch: session.fetch }
  );

  console.log(savedResource);
}
