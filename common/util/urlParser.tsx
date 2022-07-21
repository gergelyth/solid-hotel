import { RoomDefinitionsUrl } from "../consts/solidIdentifiers";
import { GetUserReservationsPodUrl } from "./solidReservations";

/** Derives the reservation ID from the reservation inbox URL provided. */
export function GetReservationIdFromInboxUrl(url: string): string {
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  const regex = new RegExp(".*/reservations/(.*)/inbox");
  const reservationId = url.match(regex)?.pop();

  if (!reservationId) {
    throw new Error("Reservation ID empty. Wrong inbox URL parsing logic.");
  }

  return reservationId;
}

/** Constructs the reservation inbox URL from the reservation ID provided. */
export function CreateInboxUrlFromReservationId(reservationId: string): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/inbox`;
}

/** Constructs the reservation URL from the reservation ID provided. */
export function CreateReservationUrlFromReservationId(
  reservationId: string
): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/reservation`;
}

/** Derives the core reservation container URL from the reservation inbox URL provided. */
export function GetCoreReservationFolderFromInboxUrl(inboxUrl: string): string {
  //delete trailing slash character if necessary
  inboxUrl = inboxUrl.replace(/\/$/, "");
  return inboxUrl.replace(new RegExp("inbox$"), "");
}

/** Derives the core reservation container URL from the reservation URL provided. */
export function GetCoreReservationFolderFromReservationUrl(
  reservationUrl: string
): string {
  //delete trailing slash character if necessary
  reservationUrl = reservationUrl.replace(/\/$/, "");
  return reservationUrl.replace(new RegExp("reservation$"), "");
}

/** Constructs the reservation inbox URL from the reservation URL provided. */
export function GetInboxUrlFromReservationUrl(reservationUrl: string): string {
  //TODO this is not very robust
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  return reservationUrl.replace(new RegExp("reservation$"), "inbox");
}

/** Constructs the reservation URL from the reservation inbox URL provided. */
export function GetReservationUrlFromInboxUrl(inboxUrl: string): string {
  //TODO this is not very robust
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  return inboxUrl.replace(new RegExp("inbox$"), "reservation");
}

/** Constructs the room URL from the room ID provided. */
export function GetRoomUrlFromRoomId(roomId: string): string {
  return RoomDefinitionsUrl + roomId;
}

/** Derives the ID part of the URL from the URL provided based on the index argument. */
export function GetIdFromDatasetUrl(
  url: string,
  idIndexFromLast: number
): string {
  const urlParts = url.split("/");
  const lastElement = urlParts[urlParts.length - 1];
  if (!lastElement || lastElement.trim() === "") {
    //if it's a container, i.e. the URL is ending in a /
    urlParts.pop();
  }
  const result = urlParts[urlParts.length - 1 - idIndexFromLast];
  if (!result) {
    throw new Error(`Bad dataset url [${url}]`);
  }

  return result;
}

/** Derives the core Pod URL from the WebId provided. */
export function GetCoreFolderFromWebId(webId: string): string {
  return webId.replace("profile/card#me", "");
}
