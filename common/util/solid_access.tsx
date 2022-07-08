import {
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  setPublicResourceAccess,
  Access,
  setPublicDefaultAccess,
} from "@inrupt/solid-client";
import { SafeGetDatasetWithAcl, SafeSaveAclFor } from "./solid_wrapper";

async function SetPublicAccess(
  resourceUrl: string,
  accessSpecification: Access,
  isDefaultAccess: boolean
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

  let updatedAcl;
  if (isDefaultAccess) {
    updatedAcl = setPublicDefaultAccess(resourceAcl, accessSpecification);
    updatedAcl = setPublicResourceAccess(updatedAcl, accessSpecification);
  } else {
    updatedAcl = setPublicResourceAccess(resourceAcl, accessSpecification);
  }

  await SafeSaveAclFor(datasetWithAcl, updatedAcl);
}

//TODO use the new Solid API if transition from beta before deadline
export async function SetSubmitterAccessToEveryone(
  resourceUrl: string
): Promise<void> {
  await SetPublicAccess(
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

export async function SetReadAccessToEveryone(
  resourceUrl: string
): Promise<void> {
  await SetPublicAccess(
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
