import {
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  setPublicResourceAccess,
  Access,
  setPublicDefaultAccess,
  setAgentDefaultAccess,
  setAgentResourceAccess,
} from "@inrupt/solid-client";
import { SafeGetDatasetWithAcl, SafeSaveAclFor } from "./solid_wrapper";

/**
 * Set the access to the permissions passed as an argument.
 * If a WebId is supplied, the access is set only for that agent.
 * If no WebId is passed, the access is set for Public.
 * Fetches the dataset and modifies the corresponding ACL file (or creates an appropriate one).
 * Saves the ACL file back in the Solid Pod.
 */
async function SetAccess(
  resourceUrl: string,
  accessSpecification: Access,
  isDefaultAccess: boolean,
  webId?: string
): Promise<void> {
  const datasetWithAcl = await SafeGetDatasetWithAcl(resourceUrl);
  if (!datasetWithAcl) {
    return;
  }

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

  let updatedAcl = resourceAcl;
  if (isDefaultAccess) {
    updatedAcl = webId
      ? setAgentDefaultAccess(updatedAcl, webId, accessSpecification)
      : setPublicDefaultAccess(updatedAcl, accessSpecification);
  }

  updatedAcl = webId
    ? setAgentResourceAccess(updatedAcl, webId, accessSpecification)
    : setPublicResourceAccess(updatedAcl, accessSpecification);

  await SafeSaveAclFor(datasetWithAcl, updatedAcl);
}

//TODO use the new Solid API if transition from beta before deadline
/**
 * Give the Public permission to Submit to the container specified.
 */
export async function SetSubmitterAccessToEveryone(
  resourceUrl: string
): Promise<void> {
  await SetAccess(
    resourceUrl,
    {
      read: false,
      append: true,
      write: false,
      control: false,
    },
    false
  );
}

/**
 * Give the Public permission to Read for the container specified.
 */
export async function SetReadAccessToEveryone(
  resourceUrl: string
): Promise<void> {
  await SetAccess(
    resourceUrl,
    {
      read: true,
      append: false,
      write: false,
      control: false,
    },
    true
  );
}

/**
 * Gives a Solid user with the WebId specified permission to Submit for the container specified.
 */
export async function SetSubmitterAccessToAgent(
  resourceUrl: string,
  webId: string
): Promise<void> {
  await SetAccess(
    resourceUrl,
    {
      read: false,
      append: true,
      write: false,
      control: false,
    },
    false,
    webId
  );
}

/**
 * Gives a Solid user with the WebId specified permission to Read for the container specified.
 */
export async function SetReadAccessToAgent(
  resourceUrl: string,
  webId: string
): Promise<void> {
  await SetAccess(
    resourceUrl,
    {
      read: true,
      append: false,
      write: false,
      control: false,
    },
    true,
    webId
  );
}
