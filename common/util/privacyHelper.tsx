import {
  saveSolidDatasetInContainer,
  SolidDataset,
} from "@inrupt/solid-client";
import { PrivacyToken } from "../types/PrivacyToken";
import { GetSession } from "./solid";

export async function SavePrivacyTokenToTargetContainer(
  dataset: SolidDataset,
  containerUrl: string
): Promise<void> {
  const session = GetSession();
  await saveSolidDatasetInContainer(containerUrl, dataset, {
    fetch: session.fetch,
  });
}

export async function AnonymizeFieldsAndDeleteToken(
  privacyToken: PrivacyToken
): Promise<void> {}
