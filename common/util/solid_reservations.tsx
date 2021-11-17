import {
  createContainerAt,
  createContainerInContainer,
  getSourceUrl,
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setInteger,
  setStringNoLocale,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";
import { GetDataSet, GetPodOfSession, GetSession } from "./solid";
import { CreateReservationDataset } from "./datasetFactory";
import { SetSubmitterAccessToEveryone } from "./solid_access";
import { GetGuestReservationUrlFromReservationId } from "./urlParser";

const reservationAddress = "reservations/";

export function GetUserReservationsPodUrl(
  session: Session = GetSession()
): string | null {
  const podOfSession = GetPodOfSession(session);
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + reservationAddress;
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

  try {
    await createContainerAt(reservationsUrl, { fetch: session.fetch });
  } catch {
    undefined;
  }

  const reservationContainer = await createContainerInContainer(
    reservationsUrl,
    {
      fetch: session.fetch,
    }
  );
  const reservationContainerUrl = getSourceUrl(reservationContainer);

  await saveSolidDatasetAt(
    reservationContainerUrl + "reservation",
    reservationDataset,
    {
      fetch: session.fetch,
    }
  );

  const inboxUrl = CreateInboxForReservationUrl(
    reservationContainerUrl,
    session
  );
  return inboxUrl;
}

async function CreateInboxForReservationUrl(
  reservationContainerUrl: string,
  session = GetSession()
): Promise<string> {
  const inboxUrl = reservationContainerUrl + "inbox";
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
  const datasetUrl = GetGuestReservationUrlFromReservationId(reservationId);
  const dataset = await GetDataSet(datasetUrl, session);

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
    updatedReservation,
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
): Promise<Thing> {
  //TODO duplication getting this dataset
  const datasetUrl = GetGuestReservationUrlFromReservationId(reservationId);
  const dataset = await GetDataSet(datasetUrl, session);

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

  return reservationThing;
}

export async function SetReservationOwnerAndState(
  reservationId: string,
  ownerWebId: string,
  newState: ReservationState,
  session = GetSession()
): Promise<void> {
  //TODO duplication getting this dataset
  const datasetUrl = GetGuestReservationUrlFromReservationId(reservationId);
  const dataset = await GetDataSet(datasetUrl, session);

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
    updatedReservation,
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
  const datasetUrl = GetGuestReservationUrlFromReservationId(reservationId);
  const dataset = await GetDataSet(datasetUrl, session);

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
