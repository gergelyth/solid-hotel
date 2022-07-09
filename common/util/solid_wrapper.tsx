import {
  createContainerAt,
  createContainerInContainer,
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

function ParseAndShowSolidError(e: unknown): void {
  let message = e;
  if (e instanceof Error) {
    message = e.message;
  }

  const helpMessage = "";
  //TODO parse based on the error code
  ShowError(`${helpMessage} [${message}]`, false);
}

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

export async function SafeDeleteDataset(url: string): Promise<void> {
  const session = GetSession();
  try {
    await deleteSolidDataset(url, { fetch: session.fetch });
  } catch (e: unknown) {
    ParseAndShowSolidError(e);
  }
}

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
