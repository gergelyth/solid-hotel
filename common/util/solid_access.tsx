import {
  getSolidDatasetWithAcl,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  saveAclFor,
  setPublicResourceAccess,
  Access,
  setPublicDefaultAccess,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { GetSession } from "./solid";

async function SetPublicAccess(
  resourceUrl: string,
  accessSpecification: Access,
  isDefaultAccess: boolean,
  session: Session
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

  let updatedAcl;
  if (isDefaultAccess) {
    updatedAcl = setPublicDefaultAccess(resourceAcl, accessSpecification);
    updatedAcl = setPublicResourceAccess(updatedAcl, accessSpecification);
  } else {
    updatedAcl = setPublicResourceAccess(resourceAcl, accessSpecification);
  }

  await saveAclFor(datasetWithAcl, updatedAcl, { fetch: session.fetch });
}

//TODO use the new Solid API if transition from beta before deadline
export async function SetSubmitterAccessToEveryone(
  resourceUrl: string,
  session: Session = GetSession()
): Promise<void> {
  await SetPublicAccess(
    resourceUrl,
    {
      read: false,
      append: true,
      write: false,
      control: false,
    },
    false,
    session
  );
}

export async function SetReadAccessToEveryone(
  resourceUrl: string,
  session: Session = GetSession()
): Promise<void> {
  await SetPublicAccess(
    resourceUrl,
    {
      read: true,
      append: false,
      write: false,
      control: false,
    },
    true,
    session
  );
}
