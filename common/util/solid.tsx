import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  removeAll,
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
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { cancellationFieldToRdfMap } from "../vocabularies/rdf_cancellation";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";
import { CreateReservationDataset } from "./solidCommon";

export type SolidProfile = {
  profileAddress: string;
  profile: Thing | null;
  //TODO we probably don't need these
  dataSet: SolidDataset | null;
};

const reservationAddress = "reservations/";
const reservationInbox = "reservations/inbox";

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

export function GetPodOfSession(
  session: Session = GetSession()
): string | null {
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

  return GetProfileOf(session.info.webId, session);
}

export async function GetProfileOf(
  webId: string | undefined,
  session: Session = GetSession()
): Promise<SolidProfile | null> {
  if (!webId) {
    return null;
  }

  const profileAddress = webId.split("#")[0];
  const dataSet = await getSolidDataset(profileAddress, {
    fetch: session.fetch,
  });

  const profile = getThing(dataSet, webId);

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

export async function SetField(
  field: string,
  value: string,
  webId?: string
): Promise<void> {
  const session = getDefaultSession();
  const solidProfile = webId
    ? await GetProfileOf(webId, session)
    : await GetProfile();

  return SetFieldInSolidProfile(solidProfile, field, value, session);
}

export async function SetFieldInSolidProfile(
  solidProfile: SolidProfile | null,
  field: string,
  value: string,
  session: Session
): Promise<void> {
  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = setStringNoLocale(solidProfile.profile, field, value);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await saveSolidDatasetAt(solidProfile.profileAddress, updatedDataSet, {
    fetch: session.fetch,
  });
}

export async function RemoveField(field: string): Promise<void> {
  const session = getDefaultSession();
  const solidProfile = await GetProfile();

  if (!solidProfile || !solidProfile.profile || !solidProfile.dataSet) {
    throw new NotFoundError("Profile not found.");
  }

  const updatedProfile = removeAll(solidProfile.profile, field);
  const updatedDataSet = setThing(solidProfile.dataSet, updatedProfile);

  await saveSolidDatasetAt(solidProfile.profileAddress, updatedDataSet, {
    fetch: session.fetch,
  });
}

export function GetReservationInboxUrl(
  session: Session = getDefaultSession()
): string | null {
  const podOfSession = GetPodOfSession(session);
  if (!podOfSession) {
    return null;
  }
  const inboxUrl = podOfSession + "/" + reservationInbox;
  CreateInboxIfNecessary(inboxUrl, session);
  return inboxUrl;
}

export function GetReservationInboxFromWebId(webId: string): string {
  return webId.replace("profile/card#me", reservationInbox);
}

async function CreateInboxIfNecessary(
  inboxUrl: string,
  session: Session = getDefaultSession()
): Promise<void> {
  const dataSet = await getSolidDataset(inboxUrl, {
    fetch: session.fetch,
  });

  if (dataSet) {
    return;
  }

  await saveSolidDatasetAt(inboxUrl, createSolidDataset(), {
    fetch: session.fetch,
  });
  //TODO we have to set the Submitter permission here!
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

export async function SetReservationStateAndInbox(
  reservationId: string,
  newState: ReservationState,
  inboxUrl: string,
  session = GetSession()
): Promise<void> {
  const datasetUrl = GetUserReservationsPodUrl(session) + reservationId;
  const dataset = await GetDataSet(datasetUrl, session);

  //TODO this is not working now with the new inbox structure
  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new NotFoundError(`Thing [#reservation] not found at ${datasetUrl}`);
  }

  let updatedReservation = setInteger(
    reservationThing,
    reservationFieldToRdfMap.state,
    newState.valueOf()
  );
  updatedReservation = setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.inbox,
    inboxUrl
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}

export async function SetReservationOwnerToHotelProfile(
  reservationId: string,
  hotelProfileWebId: string,
  session = GetSession()
): Promise<void> {
  //TODO duplication getting this dataset
  const datasetUrl = GetUserReservationsPodUrl(session) + reservationId;
  const dataset = await GetDataSet(datasetUrl, session);

  //TODO this is not working now with the new inbox structure
  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new NotFoundError(`Thing [#reservation] not found at ${datasetUrl}`);
  }

  const updatedReservation = setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.owner,
    hotelProfileWebId
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}

export async function GetWebIdFromReservation(
  reservationId: string,
  session = GetSession()
): Promise<string | null> {
  //TODO duplication getting this dataset
  const datasetUrl = GetUserReservationsPodUrl(session) + reservationId;
  const dataset = await GetDataSet(datasetUrl, session);

  //TODO this is not working now with the new inbox structure
  const reservationThing = getThing(dataset, datasetUrl + "#reservation");
  if (!reservationThing) {
    throw new NotFoundError(`Thing [#reservation] not found at ${datasetUrl}`);
  }

  const ownerWebId = getStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.owner
  );

  return ownerWebId;
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

export function CreateInboxForReservation(
  reservation: ReservationAtHotel
): string {
  //TODO - we have to set the publish permission
  return "";
}
