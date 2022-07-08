import {
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
import { ShowErrorSnackbar } from "../components/snackbar";
import { GetSession } from "./solid";

function ParseAndShowSolidError(message: string): void {
  const helpMessage = "";
  //TODO parse based on the error code
  ShowErrorSnackbar(`${helpMessage} [${message}]`);
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
  } catch (e) {
    ParseAndShowSolidError(e.message);
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
  } catch (e) {
    ParseAndShowSolidError(e.message);
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
  } catch (e) {
    ParseAndShowSolidError(e.message);
  }
}

export async function SafeDeleteDataset(url: string): Promise<void> {
  const session = GetSession();
  try {
    await deleteSolidDataset(url, { fetch: session.fetch });
  } catch (e) {
    ParseAndShowSolidError(e.message);
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
  } catch (e) {
    ParseAndShowSolidError(e.message);
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
  } catch (e) {
    ParseAndShowSolidError(e.message);
  }
}
