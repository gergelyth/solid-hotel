import { GetUserReservationsPodUrl } from "./solid_reservations";

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

export function CreateInboxUrlFromReservationId(reservationId: string): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/inbox`;
}

//TODO this is the same as the one below
export function CreateReservationUrlFromReservationId(
  reservationId: string
): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/reservation`;
}

export function GetGuestReservationUrlFromReservationId(
  reservationId: string
): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/reservation`;
}

export function GetCoreReservationFolderFromInboxUrl(inboxUrl: string): string {
  //delete trailing slash character if necessary
  inboxUrl = inboxUrl.replace(/\/$/, "");
  return inboxUrl.replace(new RegExp("inbox$"), "");
}

export function GetCoreReservationFolderFromReservationUrl(
  reservationUrl: string
): string {
  //delete trailing slash character if necessary
  reservationUrl = reservationUrl.replace(/\/$/, "");
  return reservationUrl.replace(new RegExp("reservation$"), "");
}

export function GetInboxUrlFromReservationUrl(reservationUrl: string): string {
  //TODO this is not very robust
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  return reservationUrl.replace(new RegExp("reservation$"), "inbox");
}

export function GetReservationUrlFromInboxUrl(inboxUrl: string): string {
  //TODO this is not very robust
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  return inboxUrl.replace(new RegExp("inbox$"), "reservation");
}

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
