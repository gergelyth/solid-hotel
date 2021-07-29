//TODO the token will be in userpod.com/reservations/394839/pairingToken

//TODO this is very much PMS specific - it's only in common because of the hotel Pod population
// is there a better structure for this?

import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  deleteSolidDataset,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { GetSession } from "./solid";
import { pairingTokenToRdfMap } from "../vocabularies/rdf_pairingToken";

const PairingTokenThing = "pairingToken";

function GetTokenDatasetUrl(reservationFolder: string): string {
  return `${reservationFolder}${PairingTokenThing}`;
}

export async function CreateAndSavePairingToken(
  reservationFolder: string,
  session: Session = GetSession()
): Promise<void> {
  const token = Math.random().toString(36);

  let tokenDataset = createSolidDataset();

  let tokenThing = createThing({ name: PairingTokenThing });
  tokenThing = addStringNoLocale(
    tokenThing,
    pairingTokenToRdfMap.pairingToken,
    token
  );

  tokenDataset = setThing(tokenDataset, tokenThing);

  const tokenUrl = GetTokenDatasetUrl(reservationFolder);
  await saveSolidDatasetAt(tokenUrl, tokenDataset, {
    fetch: session.fetch,
  });
}

export async function GetPairingToken(
  reservationFolder: string,
  session: Session = GetSession()
): Promise<string | null> {
  const tokenUrl = GetTokenDatasetUrl(reservationFolder);

  const tokenDataset = await getSolidDataset(tokenUrl, {
    fetch: session.fetch,
  });
  if (!tokenDataset) {
    return null;
  }

  const tokenThing = getThing(tokenDataset, tokenUrl + `#${PairingTokenThing}`);
  if (!tokenThing) {
    return null;
  }

  const token = getStringNoLocale(
    tokenThing,
    pairingTokenToRdfMap.pairingToken
  );
  return token;
}

export async function DeletePairingToken(
  reservationFolder: string,
  session: Session = GetSession()
): Promise<void> {
  const tokenUrl = GetTokenDatasetUrl(reservationFolder);
  deleteSolidDataset(tokenUrl, { fetch: session.fetch });
}
