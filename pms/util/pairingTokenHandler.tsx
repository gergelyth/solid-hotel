//TODO the token will be in userpod.com/reservations/394839/pairingToken

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
import { GetSession } from "../../common/util/solid";
import { pairingTokenToRdfMap } from "../../common/vocabularies/rdf_pairingToken";

const PairingTokenThing = "pairingToken";

function GetTokenDatasetUrl(reservationUrl: string): string {
  return `${reservationUrl}/${PairingTokenThing}`;
}

export async function CreateAndSavePairingToken(
  reservationUrl: string,
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

  const tokenUrl = GetTokenDatasetUrl(reservationUrl);
  await saveSolidDatasetAt(tokenUrl, tokenDataset, {
    fetch: session.fetch,
  });
}

export async function GetPairingToken(
  reservationUrl: string,
  session: Session = GetSession()
): Promise<string | null> {
  const tokenUrl = GetTokenDatasetUrl(reservationUrl);

  const tokenDataset = await getSolidDataset(tokenUrl, {
    fetch: session.fetch,
  });
  if (!tokenDataset) {
    return null;
  }

  const tokenThing = getThing(tokenDataset, `#${PairingTokenThing}`);
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
  reservationUrl: string,
  session: Session = GetSession()
): Promise<void> {
  const tokenUrl = GetTokenDatasetUrl(reservationUrl);
  deleteSolidDataset(tokenUrl, { fetch: session.fetch });
}
