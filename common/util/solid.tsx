import { SolidDataset, WithResourceInfo } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { NotFoundError } from "./errors";
import { SafeGetDataset } from "./solid_wrapper";

const privacyAddress = "privacy/";

export function GetSession(): Session {
  return getDefaultSession();
}

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = GetSession();
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

export async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = GetSession();
  await session.login({
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
  });
}

export async function SolidLogout(): Promise<void> {
  const session = GetSession();
  if (!session) {
    return;
  }
  await session.logout();
}

export function GetPodOfSession(): string | null {
  const session = GetSession();
  const webId = session.info.webId;
  if (!webId) {
    return null;
  }

  const hostname = new URL(webId)?.hostname;
  return "https://" + hostname;
}

export async function GetDataSet(
  url: string
): Promise<SolidDataset & WithResourceInfo> {
  const dataSet = await SafeGetDataset(url);

  if (!dataSet) {
    throw new NotFoundError(`Dataset at ${url} not found.`);
  }

  return dataSet;
}

export function GetUserPrivacyPodUrl(): string | null {
  const podOfSession = GetPodOfSession();
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + privacyAddress;
}
