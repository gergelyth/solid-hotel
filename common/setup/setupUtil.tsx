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

export const SerializationBaseDate = new Date(Date.UTC(1970, 0, 1));
export const AclFilename = "acl";
export const AclFileRegex = `.*${AclFilename}$`;

export function GetPodBaseUrl(session: Session): string | undefined {
  const webId = session.info.webId;
  if (!webId) {
    ShowErrorSnackbar("The user is not logged in!");
    return;
  }

  return GetCoreFolderFromWebId(webId);
}

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
