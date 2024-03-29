import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import { GetDataSet, GetThing } from "./solid";
import { PairingTokenToRdfMap } from "../vocabularies/rdfPairingToken";
import { SafeDeleteDataset, SafeSaveDatasetAt } from "./solidWrapper";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/** The name of the Solid Thing containing the pairing token. */
const PairingTokenThing = "pairingToken";

/** @returns The URL path of the pairing token contained in the reservation folder supplied. */
function GetTokenDatasetUrl(reservationFolder: string): string {
  return `${reservationFolder}${PairingTokenThing}`;
}

/**
 * Creates a random string as a pairing token and saves it in the reservation folder for a given reservation.
 */
export async function CreateAndSavePairingToken(
  reservationFolder: string
): Promise<void> {
  const token = Math.random().toString(36);

  let tokenDataset = createSolidDataset();

  let tokenThing = createThing({ name: PairingTokenThing });
  tokenThing = addUrl(tokenThing, UtilRdfMap.type, PairingTokenToRdfMap.type);
  tokenThing = addStringNoLocale(
    tokenThing,
    PairingTokenToRdfMap.pairingToken,
    token
  );

  tokenDataset = setThing(tokenDataset, tokenThing);

  const tokenUrl = GetTokenDatasetUrl(reservationFolder);
  await SafeSaveDatasetAt(tokenUrl, tokenDataset);
}

/**
 * Retrieves the pairing token string from a given reservation folder for a given reservation.
 * @returns The pairing token string.
 */
export async function GetPairingToken(
  reservationFolder: string
): Promise<string | null> {
  const tokenUrl = GetTokenDatasetUrl(reservationFolder);

  const tokenDataset = await GetDataSet(tokenUrl);
  if (!tokenDataset) {
    return null;
  }

  const tokenThing = GetThing(tokenDataset, PairingTokenThing);
  if (!tokenThing) {
    return null;
  }

  const token = getStringNoLocale(
    tokenThing,
    PairingTokenToRdfMap.pairingToken
  );
  return token;
}

/**
 * Deletes the pairing token from the hotel's Solid Pod.
 */
export async function DeletePairingToken(
  reservationFolder: string
): Promise<void> {
  const tokenUrl = GetTokenDatasetUrl(reservationFolder);
  await SafeDeleteDataset(tokenUrl);
}
