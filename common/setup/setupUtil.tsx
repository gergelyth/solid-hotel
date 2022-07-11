import {
  createContainerAt,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";
import { GetSession } from "../util/solid";
import { SetSubmitterAccessToEveryone } from "../util/solid_access";
import { SafeDeleteDataset, SafeGetDataset } from "../util/solid_wrapper";
import { Session } from "@inrupt/solid-client-authn-browser";
import { ShowErrorSnackbar } from "../components/snackbar";
import { GetCoreFolderFromWebId } from "../util/urlParser";

/** The base date according to which the relative dates are saved/loaded during (de)serialization. */
export const SerializationBaseDate = new Date(Date.UTC(1970, 0, 1));
/** File extension of the ACL files. Used during (de)serialization. */
export const AclFilename = "acl";
/** To help match ACL files in the Pod. Used during (de)serialization. */
export const AclFileRegex = `.*${AclFilename}$`;

/**
 * Gets the base Pod URL according to the currently logged in session.
 * @returns The base URL.
 */
export function GetPodBaseUrl(session: Session): string | undefined {
  const webId = session.info.webId;
  if (!webId) {
    ShowErrorSnackbar("The user is not logged in!");
    return;
  }

  return GetCoreFolderFromWebId(webId);
}

/**
 * Recursively deletes all items contained in the URL passed as argument.
 * At the end, the container itself is deleted.
 * Helper function - required by the setup functionality.
 */
export async function RecursiveDelete(url: string): Promise<void> {
  const dataSet = await SafeGetDataset(url);
  if (!dataSet) {
    return;
  }

  //in case it's a container
  const urls = getContainedResourceUrlAll(dataSet);
  await Promise.all(urls.map((url) => RecursiveDelete(url)));

  await SafeDeleteDataset(url);
}

/**
 * Creates the privacy token containers in the Pod, but no further items in them.
 * Helper function - required by the setup functionality.
 */
export async function CreatePrivacyFolders(
  privacyUrl: string,
  privacyInboxUrl?: string
): Promise<void> {
  const session = GetSession();
  await createContainerAt(privacyUrl, { fetch: session.fetch });
  if (privacyInboxUrl) {
    await createContainerAt(privacyInboxUrl, { fetch: session.fetch });
    await SetSubmitterAccessToEveryone(privacyInboxUrl);
  }
}
