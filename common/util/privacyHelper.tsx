import {
  deleteSolidDataset,
  getSolidDataset,
  getThingAll,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setStringNoLocale,
  setThing,
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

async function AnonymizeFields(
  datasetUrlTarget: string,
  fieldList: string[]
): Promise<void> {
  const session = GetSession();

  let targetDataset = await getSolidDataset(datasetUrlTarget, {
    fetch: session.fetch,
  });

  const containedThings = getThingAll(targetDataset);
  if (containedThings.length !== 1) {
    throw new Error("Only 1 contained thing is supported at the moment");
  }

  let thing = containedThings[0];
  fieldList.forEach((field) => {
    thing = setStringNoLocale(thing, field, "Anonymized");
  });

  targetDataset = setThing(targetDataset, thing);
  return new Promise(() =>
    saveSolidDatasetAt(datasetUrlTarget, targetDataset, {
      fetch: session.fetch,
    })
  );
}

export async function AnonymizeFieldsAndDeleteToken(
  privacyToken: PrivacyToken
): Promise<void> {
  if (!privacyToken.datasetUrlTarget) {
    throw new Error("Privacy token target URL is null");
  }

  const session = GetSession();
  AnonymizeFields(privacyToken.datasetUrlTarget, privacyToken.fieldList).then(
    () => deleteSolidDataset(privacyToken.url, { fetch: session.fetch })
  );
}
