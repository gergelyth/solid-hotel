import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setInteger,
  setStringNoLocale,
  setThing,
  SolidDataset,
  Thing,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { cancellationFieldToRdfMap } from "../vocabularies/rdf_cancellation";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";
import { CreateReservationDataset } from "./solidCommon";
import { cancellationsUrl } from "./solidhoteladmin";

export type SolidProfile = {
  profileAddress: string;
  profile: Thing | null;
  dataSet: SolidDataset | null;
};

const reservationAddress = "reservations/";

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = getDefaultSession();
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

export async function SolidLogin(oidcIssuer: string): Promise<void> {
  const session = getDefaultSession();
  await session.login({
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
  });
}

export function GetUserReservationsPodUrl(
  session: Session = GetSession()
): string | null {
  const podOfSession = GetPodOfSession(session);
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + reservationAddress;
}

export async function SolidLogout(): Promise<void> {
  const session = GetSession();
  if (session == null) {
    return;
  }
  await session.logout();
}

export function GetSession(): Session {
  return getDefaultSession();
}

function GetPodOfSession(session: Session = GetSession()): string | null {
  const webId = session.info.webId;
  if (!webId) {
    return null;
  }

  const hostname = new URL(webId)?.hostname;
  return "https://" + hostname;
}

export async function GetDataSet(
  url: string,
  session: Session = GetSession()
): Promise<SolidDataset & WithResourceInfo> {
  const dataSet = await getSolidDataset(url, {
    fetch: session.fetch,
  });

  if (!dataSet) {
    throw new NotFoundError(`Dataset at ${url} not found.`);
  }

  return dataSet;
}

export async function GetProfile(
  session: Session = GetSession()
): Promise<SolidProfile | null> {
  if (!session.info.webId) {
    console.log("WebID null");
    return null;
  }

  const solidPodAddress = GetPodOfSession(session);
  if (!solidPodAddress) {
    return null;
  }

  const profileAddress = solidPodAddress + "/profile/card";
  const dataSet = await getSolidDataset(profileAddress, {
    fetch: session.fetch,
  });

  const profile = getThing(dataSet, session.info.webId);

  return { profileAddress, profile, dataSet };
}

export async function GetField(field: string): Promise<string> {
  const solidProfile = await GetProfile();

  if (!solidProfile || !solidProfile.profile) {
    throw new NotFoundError("Profile not found.");
  }

  const value = getStringNoLocale(solidProfile.profile, field);
  if (!value) {
    throw new NotFoundError("Field not found in the Solid Pod.");
  }

  return value;
}

export async function SetField(field: string, value: string): Promise<void> {
  const session = getDefaultSession();
  const solidProfile = await GetProfile();

  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = setStringNoLocale(solidProfile.profile, field, value);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await saveSolidDatasetAt(solidProfile.profileAddress, updatedDataSet, {
    fetch: session.fetch,
  });
}

export async function AddReservation(
  reservation: ReservationAtHotel,
  session = GetSession()
): Promise<void> {
  const reservationDataset = CreateReservationDataset(reservation);

  const reservationsUrl = GetUserReservationsPodUrl(session);

  await saveSolidDatasetAt(
    reservationsUrl + reservation.id,
    reservationDataset,
    {
      fetch: session.fetch,
    }
  );
}

export async function SetReservationState(
  reservationId: string,
  newState: ReservationState,
  session = GetSession()
): Promise<void> {
  const datasetUrl = GetUserReservationsPodUrl(session) + reservationId;
  const dataset = await GetDataSet(datasetUrl, session);

  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new NotFoundError(`Thing [#reservation] not found at ${datasetUrl}`);
  }

  const updatedReservation = setInteger(
    reservationThing,
    reservationFieldToRdfMap.state,
    newState.valueOf()
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}

export function CreateCancellationDataset(reservationId: string): SolidDataset {
  let cancellationDataset = createSolidDataset();

  let cancellation = createThing({ name: "cancellation" });
  cancellation = addStringNoLocale(
    cancellation,
    cancellationFieldToRdfMap.reservationId,
    reservationId
  );

  cancellationDataset = setThing(cancellationDataset, cancellation);
  return cancellationDataset;
}

export async function AddCancellationRequest(
  reservationId: string,
  session = GetSession()
): Promise<void> {
  const cancellationDataset = CreateCancellationDataset(reservationId);

  await saveSolidDatasetAt(
    cancellationsUrl + reservationId,
    cancellationDataset,
    {
      fetch: session.fetch,
    }
  );
}
