import {
  getSourceUrl,
  getStringNoLocale,
  setStringNoLocale,
  setThing,
  setUrl,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { ReservationAtHotel } from "../types/ReservationAtHotel";
import { ReservationState } from "../types/ReservationState";
import { ReservationFieldToRdfMap } from "../vocabularies/rdfReservation";
import { NotFoundError } from "./errors";
import { GetDataSet, GetPodOfSession, GetThing } from "./solid";
import { CreateReservationDataset } from "./datasetFactory";
import { SetSubmitterAccessToEveryone } from "./solidAccess";
import {
  CreateReservationUrlFromReservationId,
  GetReservationUrlFromInboxUrl,
} from "./urlParser";
import { ParseReservation } from "../hooks/useReservations";
import {
  SafeCreateContainerAt,
  SafeCreateContainerInContainer,
  SafeSaveDatasetAt,
} from "./solidWrapper";
import { ReservationStateRdfMap } from "../vocabularies/rdfReservationStatusTypes";
import { PersonFieldToRdfMap } from "../vocabularies/rdfPerson";

/** The relative URL address of the reservation container. */
const reservationAddress = "reservations/";

/**
 * @returns The absolute URL of the reservation container based on the Solid Pod address of the currently logged in user.
 */
export function GetUserReservationsPodUrl(): string | null {
  const podOfSession = GetPodOfSession();
  if (!podOfSession) {
    return null;
  }
  return podOfSession + "/" + reservationAddress;
}

/**
 * Creates the reservation dataset from the reservation object supplied as argument and saves it in the reservation container.
 * Also creates the inbox for the reservation and adds submitter access for the WebId specified - if no WebId is specified, it sets the access to Public.
 * @returns The URL of the reservation inbox.
 */
export async function AddReservation(
  reservation: ReservationAtHotel,
  counterPartyWebIdForInboxAccess?: string
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

  const inboxUrl = CreateInboxForReservationUrl(
    reservationContainerUrl,
    counterPartyWebIdForInboxAccess
  );
  return inboxUrl;
}

/**
 * Creates the reservation inbox for the corresponding reservation passed as URL.
 * Adds submitter access for the WebId specified - if no WebId is specified, it sets the access to Public.
 * @returns The URL of the reservation inbox.
 */
async function CreateInboxForReservationUrl(
  reservationContainerUrl: string,
  counterPartyWebIdForInboxAccess?: string
): Promise<string> {
  const inboxUrl = reservationContainerUrl + "inbox";
  await SafeCreateContainerAt(inboxUrl);

  //Unfortunately Solid can't handle handle the authorization of a single agent.
  //We'll need to wait for development, see programming documentation for more information.

  // if (counterPartyWebIdForInboxAccess) {
  //   await SetSubmitterAccessToAgent(inboxUrl, counterPartyWebIdForInboxAccess);
  // } else {
  //   await SetSubmitterAccessToEveryone(inboxUrl);
  // }
  await SetSubmitterAccessToEveryone(inboxUrl);
  return inboxUrl;
}

/**
 * Retrieves the reservation dataset and Solid Thing of the corresponding reservation referred to with the URL supplied.
 * Throws an error if there's an issue with the integrity of the structure.
 * @returns The reservation dataset and Thing.
 */
async function GetReservationDatasetAndThing(
  reservationUrl: string
): Promise<{ dataset: SolidDataset; thing: Thing }> {
  const dataset = await GetDataSet(reservationUrl);

  const reservationThing = GetThing(dataset, "reservation");
  if (!reservationThing) {
    throw new NotFoundError(
      `Thing [reservation] not found at ${reservationUrl}`
    );
  }

  return { dataset: dataset, thing: reservationThing };
}

/**
 * Constructs the absolute URL of the reservation based on the hotel inbox URL.
 * Saves the email of the guest to the reservation.
 */
export async function SetEmailAddressOfGuest(
  hotelInboxUrl: string,
  email: string
): Promise<void> {
  const datasetUrl = GetReservationUrlFromInboxUrl(hotelInboxUrl);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);
  const updatedReservation = setStringNoLocale(
    thing,
    PersonFieldToRdfMap.email,
    email
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

/**
 * Constructs the absolute URL of the reservation based on the ID and fetches the reservation dataset.
 * Sets the reservation state and the counterparty inbox value to the values supplied.
 */
export async function SetReservationStateAndInbox(
  reservationId: string,
  newState: ReservationState,
  inboxUrl?: string
): Promise<void> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);
  let updatedReservation = setUrl(
    thing,
    ReservationFieldToRdfMap.state,
    ReservationStateRdfMap[newState]
  );
  if (inboxUrl) {
    updatedReservation = setStringNoLocale(
      updatedReservation,
      ReservationFieldToRdfMap.inbox,
      inboxUrl
    );
  }
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

/**
 * Constructs the absolute URL of the reservation based on the ID and fetches the reservation dataset.
 * Sets the reservation owner field to point to the hotel profile of the guest.
 */
export async function SetReservationOwnerToHotelProfile(
  reservationId: string,
  hotelProfileWebId: string
): Promise<Thing> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);

  const updatedReservation = setStringNoLocale(
    thing,
    ReservationFieldToRdfMap.owner,
    hotelProfileWebId
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);

  return updatedReservation;
}

/**
 * Constructs the absolute URL of the reservation based on the ID and fetches the reservation dataset.
 * Sets the reservation state and the reservation owner value to the values supplied.
 */
export async function SetReservationOwnerAndState(
  reservationId: string,
  ownerWebId: string,
  newState: ReservationState
): Promise<void> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const { dataset, thing } = await GetReservationDatasetAndThing(datasetUrl);

  let updatedReservation = setStringNoLocale(
    thing,
    ReservationFieldToRdfMap.owner,
    ownerWebId
  );
  updatedReservation = setUrl(
    updatedReservation,
    ReservationFieldToRdfMap.state,
    ReservationStateRdfMap[newState]
  );
  const updatedDataSet = setThing(dataset, updatedReservation);

  await SafeSaveDatasetAt(datasetUrl, updatedDataSet);
}

/**
 * Constructs the absolute URL of the reservation based on the ID and fetches the reservation dataset.
 * Retrieves the WebId of the reservation owner from the dataset.
 * @returns The WebId of the reservation owner.
 */
export async function GetOwnerFromReservation(
  reservationId: string
): Promise<string | null> {
  const datasetUrl = CreateReservationUrlFromReservationId(reservationId);
  const reservation = await GetReservationDatasetAndThing(datasetUrl);

  const ownerWebId = getStringNoLocale(
    reservation.thing,
    ReservationFieldToRdfMap.owner
  );

  return ownerWebId;
}

/**
 * Fetches the reservation dataset based on the URL supplied and creates the reservation object based on the dataset retrieved.
 * @returns The reservation parsed from the dataset.
 */
export async function GetParsedReservationFromUrl(
  reservationUrl: string
): Promise<ReservationAtHotel> {
  const reservation = await GetReservationDatasetAndThing(reservationUrl);

  return ParseReservation(reservation.thing, reservationUrl);
}
