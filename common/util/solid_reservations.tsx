import {
  getSourceUrl,
  getStringNoLocale,
  getThing,
  setInteger,
  setStringNoLocale,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { reservationFieldToRdfMap } from "../vocabularies/rdf_reservation";
import { NotFoundError } from "./errors";
import { GetDataSet, GetPodOfSession } from "./solid";
import { CreateReservationDataset } from "./datasetFactory";
import { SetSubmitterAccessToEveryone } from "./solid_access";
import { CreateReservationUrlFromReservationId } from "./urlParser";
import { ParseReservation } from "../hooks/useReservations";
import {
  SafeCreateContainerAt,
  SafeCreateContainerInContainer,
  SafeSaveDatasetAt,
} from "./solid_wrapper";
import { LocalNodeSkolemPrefix } from "../consts/solidIdentifiers";

const reservationAddress = "reservations/";

export function GetUserReservationsPodUrl(): string | null {
  const podOfSession = GetPodOfSession();
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + reservationAddress;
}

export async function AddReservation(
  reservation: ReservationAtHotel
): Promise<string> {
  const reservationDataset = CreateReservationDataset(reservation);

  const reservationsUrl = GetUserReservationsPodUrl();
  if (!reservationsUrl) {
    throw new Error("Reservations url is null");
  }

  await SafeCreateContainerAt(reservationsUrl);

  const reservationContainer = await SafeCreateContainerInContainer(
    reservationsUrl
  );
  if (!reservationContainer) {
    return "";
  }
  const reservationContainerUrl = getSourceUrl(reservationContainer);

  await SafeSaveDatasetAt(
    reservationContainerUrl + "reservation",
    reservationDataset
  );

  const inboxUrl = CreateInboxForReservationUrl(reservationContainerUrl);
  return inboxUrl;
}

async function CreateInboxForReservationUrl(
  reservationContainerUrl: string
): Promise<string> {
  const inboxUrl = reservationContainerUrl + "inbox";
  await SafeCreateContainerAt(inboxUrl);
  await SetSubmitterAccessToEveryone(inboxUrl);
  return inboxUrl;
}

async function GetReservationDatasetAndThing(
  reservationUrl: string
): Promise<{ dataset: SolidDataset; thing: Thing }> {
  const dataset = await GetDataSet(reservationUrl);

  const reservationThing = getThing(
    dataset,
    LocalNodeSkolemPrefix + "reservation"
  );
  if (!reservationThing) {
    throw new NotFoundError(
      `Thing [reservation] not found at ${reservationUrl}`
    );
  }

  return { dataset: dataset, thing: reservationThing };
}

export async function SetReservationStateAndInbox(
  reservationId: string,
  newState: ReservationState,
  inboxUrl: string
): Promise<void> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);
  let updatedReservation = setInteger(
    thing,
    reservationFieldToRdfMap.state,
    newState.valueOf()
  );
  updatedReservation = setStringNoLocale(
    updatedReservation,
    reservationFieldToRdfMap.inbox,
    inboxUrl
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

export async function SetReservationOwnerToHotelProfile(
  reservationId: string,
  hotelProfileWebId: string
): Promise<Thing> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);

  const updatedReservation = setStringNoLocale(
    thing,
    reservationFieldToRdfMap.owner,
    hotelProfileWebId
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);

  return updatedReservation;
}

export async function SetReservationOwnerAndState(
  reservationId: string,
  ownerWebId: string,
  newState: ReservationState
): Promise<void> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);

  let updatedReservation = setStringNoLocale(
    thing,
    reservationFieldToRdfMap.owner,
    ownerWebId
  );
  updatedReservation = setInteger(
    updatedReservation,
    reservationFieldToRdfMap.state,
    newState.valueOf()
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

export async function GetOwnerFromReservation(
  reservationId: string
): Promise<string | null> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const reservation = await GetReservationDatasetAndThing(datasetUrl);

  const ownerWebId = getStringNoLocale(
    reservation.thing,
    reservationFieldToRdfMap.owner
  );

  return ownerWebId;
}

export async function GetParsedReservationFromUrl(
  reservationUrl: string
): Promise<ReservationAtHotel> {
  const reservation = await GetReservationDatasetAndThing(reservationUrl);

  return ParseReservation(reservation.thing, reservationUrl);
}
