import {
  deleteSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  SolidDataset,
  WithResourceInfo,
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
