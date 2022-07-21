import {
  createContainerAt,
  createContainerInContainer,
  deleteAclFor,
  deleteSolidDataset,
  getSolidDataset,
  getSolidDatasetWithAcl,
  saveAclFor,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  SolidDataset,
  WithAccessibleAcl,
  WithAcl,
  WithResourceInfo,
  WithServerResourceInfo,
} from "@inrupt/solid-client";
import { ShowError } from "./helpers";
import { GetSession } from "./solid";

/**
 * A general function called when a Solid operation throws an error.
 * We report the error in a snackbar and in console as well.
 */
function ParseAndShowSolidError(e: unknown): void {
  let message = e;
  if (e instanceof Error) {
    message = e.message;
  }

  const helpMessage = "";
  //TODO parse based on the error code
  ShowError(`${helpMessage} [${message}]`, false);
}

/**
 * Retrieves the Solid dataset with error catching.
 * @returns The Solid dataset found at the URL supplied.
 */
export async function SafeGetDataset(
  url: string
): Promise<(SolidDataset & WithResourceInfo) | undefined> {
  const session = GetSession();
  try {
    const dataSet = await getSolidDataset(url, {
      fetch: session.fetch,
    });
    return dataSet;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Retrieves the ACL Solid dataset with error catching.
 * @returns The ACL Solid dataset found at the URL supplied.
 */
export async function SafeGetDatasetWithAcl(
  url: string
): Promise<(SolidDataset & WithServerResourceInfo & WithAcl) | undefined> {
  const session = GetSession();
  try {
    const dataSet = await getSolidDatasetWithAcl(url, {
      fetch: session.fetch,
    });
    return dataSet;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Deletes the ACL for a Solid dataset with error catching.
 */
export async function SafeDeleteAclFor(
  datasetWithAcl: WithResourceInfo & WithAccessibleAcl
): Promise<void | undefined> {
  const session = GetSession();
  try {
    await deleteAclFor(datasetWithAcl, {
      fetch: session.fetch,
    });
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Creates a container at the URL supplied with error catching.
 * @returns The container dataset created.
 */
export async function SafeCreateContainerAt(
  containerUrl: string
): Promise<(SolidDataset & WithResourceInfo) | undefined> {
  const session = GetSession();
  try {
    const savedContainer = await createContainerAt(containerUrl, {
      fetch: session.fetch,
    });
    return savedContainer;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Creates a container in a container at the URL supplied with error catching.
 * @returns The container dataset created.
 */
export async function SafeCreateContainerInContainer(
  containerUrl: string
): Promise<(SolidDataset & WithResourceInfo) | undefined> {
  const session = GetSession();
  try {
    const savedContainer = await createContainerInContainer(containerUrl, {
      fetch: session.fetch,
    });
    return savedContainer;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Saves the ACL dataset for the given dataset with error catching.
 */
export async function SafeSaveAclFor(
  datasetWithAcl: WithAccessibleAcl,
  updatedAcl: SolidDataset
): Promise<void> {
  const session = GetSession();
  try {
    await saveAclFor(datasetWithAcl, updatedAcl, {
      fetch: session.fetch,
    });
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Deletes a Solid dataset found at the URL supplied with error catching.
 */
export async function SafeDeleteDataset(url: string): Promise<void> {
  const session = GetSession();
  try {
    await deleteSolidDataset(url, { fetch: session.fetch });
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Saves the Solid dataset with error catching.
 * @returns The Solid dataset created at the URL supplied.
 */
export async function SafeSaveDatasetAt(
  url: string,
  dataset: SolidDataset
): Promise<(SolidDataset & WithResourceInfo) | undefined> {
  const session = GetSession();
  try {
    const savedDataset = await saveSolidDatasetAt(url, dataset, {
      fetch: session.fetch,
    });
    return savedDataset;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

/**
 * Saves the Solid dataset in a container with the URL supplied with error catching.
 * @returns The Solid dataset created in the container.
 */
export async function SafeSaveDatasetInContainer(
  containerUrl: string,
  dataset: SolidDataset
): Promise<(SolidDataset & WithResourceInfo) | undefined> {
  const session = GetSession();
  try {
    const savedDataset = await saveSolidDatasetInContainer(
      containerUrl,
      dataset,
      {
        fetch: session.fetch,
      }
    );
    return savedDataset;
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}
