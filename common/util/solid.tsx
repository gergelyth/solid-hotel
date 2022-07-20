import {
  getSourceUrl,
  getThing,
  SolidDataset,
  Thing,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { UtilRdfMap } from "../vocabularies/rdfUtil";
import { NotFoundError } from "./errors";
import { SafeGetDataset } from "./solidWrapper";

/** The name of the Solid Thing containing the privacy token. */
const privacyAddress = "privacy/";

/**
 * Retrieves the default session of the current user.
 * @returns The default session.
 */
export function GetSession(): Session {
  return getDefaultSession();
}

/**
 * Checks if we can restore the session of the user and returns if the user is logged in after this.
 * @returns Whether the user is currently logged in or not.
 */
export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = GetSession();
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

/**
 * Calls the login function of the current default session with the Solid provider supplied.
 * The app redirects back to the current page after login.
 */
export async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = GetSession();
  await session.login({
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
  });
}

/**
 * Calls the logout function of the current default session.
 */
export async function SolidLogout(): Promise<void> {
  const session = GetSession();
  if (!session) {
    return;
  }
  await session.logout();
}

/**
 * Derives the Pod URL of the current session from the WebId of the currently logged in user.
 * @returns The Pod URL or null (if the user is not logged in currently).
 */
export function GetPodOfSession(): string | null {
  const session = GetSession();
  const webId = session.info.webId;
  if (!webId) {
    return null;
  }

  const hostname = new URL(webId)?.hostname;
  return "https://" + hostname;
}

/**
 * Safely retrieves a Solid dataset pointed to by the URL supplied.
 * Throws an error if the dataset is not found.
 * @returns The dataset retrieved.
 */
export async function GetDataSet(
  url: string
): Promise<SolidDataset & WithResourceInfo> {
  const dataSet = await SafeGetDataset(url);

  if (!dataSet) {
    throw new NotFoundError(`Dataset at ${url} not found.`);
  }

  return dataSet;
}

/**
 * Retrieves the Thing saved in the Solid dataset.
 * Handles local and persisted things as well.
 * @returns The Thing retrieved or null if no Thing with the given name is present.
 */
export function GetThing(
  dataset: SolidDataset,
  thingName: string
): Thing | null {
  const localThing = getThing(dataset, UtilRdfMap.localNodePrefix + thingName);
  if (localThing) {
    return localThing;
  }

  const datasetUrl = getSourceUrl(dataset);
  const thingPersisted = getThing(dataset, `${datasetUrl}#${thingName}`);
  return thingPersisted;
}

/**
 * Constructs the privacy token container URL address of the currently logged in user.
 * @returns The privacy token container URL or null (if the user is not logged in).
 */
export function GetUserPrivacyPodUrl(): string | null {
  const podOfSession = GetPodOfSession();
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + privacyAddress;
}
