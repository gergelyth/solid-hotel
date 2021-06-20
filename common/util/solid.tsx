import {
  addStringNoLocale,
  createContainerAt,
  createSolidDataset,
  createThing,
  getPropertyAll,
  getSolidDataset,
  getSourceUrl,
  getStringNoLocale,
  getTerm,
  getThing,
  removeAll,
  saveSolidDatasetAt,
  saveSolidDatasetInContainer,
  setInteger,
  setStringNoLocale,
  setTerm,
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
import { SetSubmitterAccessToEveryone } from "./solid_access";
import { GetInboxUrlFromReservationUrl } from "./urlParser";

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

export function GetReservationInboxFromWebId(webId: string): string {
  return webId.replace("profile/card#me", reservationInbox);
}

export async function AddReservation(
  reservation: ReservationAtHotel,
  session = GetSession()
): Promise<string> {
  const reservationDataset = CreateReservationDataset(reservation);

  const reservationsUrl = GetUserReservationsPodUrl(session);
  if (!reservationsUrl) {
    throw new Error("Reservations url is null");
  }

  const savedDataset = await saveSolidDatasetInContainer(
    reservationsUrl,
    reservationDataset,
    {
      fetch: session.fetch,
    }
  );

  const savedReservationUrl = getSourceUrl(savedDataset);

  const inboxUrl = CreateInboxForReservationUrl(savedReservationUrl, session);
  return inboxUrl;
}

export async function CreateInboxForReservationUrl(
  reservationUrl: string,
  session = GetSession()
): Promise<string> {
  //TODO set publish privileges
  const inboxUrl = GetInboxUrlFromReservationUrl(reservationUrl);
  await createContainerAt(inboxUrl, { fetch: session.fetch });
  await SetSubmitterAccessToEveryone(inboxUrl);
  return inboxUrl;
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

export async function SetReservationOwnerAndState(
  reservationId: string,
  ownerWebId: string,
  newState: ReservationState,
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

  let updatedReservation = setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.owner,
    ownerWebId
  );
  updatedReservation = setInteger(
    reservationThing,
    reservationFieldToRdfMap.state,
    newState.valueOf()
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

export async function SaveProfileThingToPod(
  profileThing: Thing,
  session = GetSession()
): Promise<void> {
  const properties = getPropertyAll(profileThing);

  const userProfile = await GetProfile();
  if (!userProfile) {
    throw new Error("User profile undefined");
  }

  let userProfileThing = userProfile.profile;

  properties.forEach((property) => {
    const term = getTerm(profileThing, property);
    if (!term) {
      throw new Error(`Property ${property} has no term`);
    }

    if (!userProfileThing) {
      throw new Error("UserProfileThing is undefined");
    }

    userProfileThing = setTerm(userProfileThing, property, term);
  });

  if (!userProfile.dataSet || !userProfileThing) {
    throw new Error("User profile dataset or user profile Thing is null");
  }
  const updatedDataSet = setThing(userProfile.dataSet, userProfileThing);

  await saveSolidDatasetAt(userProfile.profileAddress, updatedDataSet, {
    fetch: session.fetch,
  });
}
