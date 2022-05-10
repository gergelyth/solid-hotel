import { Session } from "@inrupt/solid-client-authn-browser";
import { ShowErrorSnackbar } from "../components/snackbar";
import { GetCoreFolderFromWebId } from "../util/urlParser";

export const BaseDate = new Date(Date.UTC(1970, 0, 1));

export function GetBaseUrl(session: Session): string | undefined {
  const webId = session.info.webId;
  if (!webId) {
    ShowErrorSnackbar("The user is not logged in!");
    return;
  }

  return GetCoreFolderFromWebId(webId);
}
