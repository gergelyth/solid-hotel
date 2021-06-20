import {
  getSolidDatasetWithAcl,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  saveAclFor,
  setPublicResourceAccess,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { GetSession } from "./solid";

export async function SetSubmitterAccessToEveryone(
  resourceUrl: string,
  session: Session = GetSession()
): Promise<void> {
  const datasetWithAcl = await getSolidDatasetWithAcl(resourceUrl, {
    fetch: session.fetch,
  });

  let resourceAcl;
  if (!hasResourceAcl(datasetWithAcl)) {
    if (!hasAccessibleAcl(datasetWithAcl)) {
      throw new Error(
        "The current user does not have permission to change access rights to this Resource."
      );
    }
    if (!hasFallbackAcl(datasetWithAcl)) {
      throw new Error(
        "The current user does not have permission to see who currently has access to this Resource."
      );
    }
    resourceAcl = createAclFromFallbackAcl(datasetWithAcl);
  } else {
    resourceAcl = getResourceAcl(datasetWithAcl);
  }

  const updatedAcl = setPublicResourceAccess(resourceAcl, {
    read: false,
    append: true,
    write: false,
    control: false,
  });

  await saveAclFor(datasetWithAcl, updatedAcl, { fetch: session.fetch });
}
