import { GetUserReservationsPodUrl } from "./solid_reservations";

export function GetReservationIdFromInboxUrl(url: string): string {
  //TODO this is not very robust
  //structure:
  //userpod.inrupt.net/reservations/49938104/reservation
  //userpod.inrupt.net/reservations/49938104/inbox
  const urlParts = url.split("/");
  if (!urlParts.pop()) {
    //pop one more (now the inbox part for sure) if there was a trailing slash
    urlParts.pop();
  }
  const reservationId = urlParts.pop();
  if (!reservationId) {
    throw new Error("Reservation ID empty. Wrong inbox URL parsing logic.");
  }

  return reservationId;
}

export function CreateInboxUrlFromReservationId(reservationId: string): string {
  const containerUrl = GetUserReservationsPodUrl();
  return `${containerUrl}${reservationId}/inbox`;
}

export function GetCoreReservationFolderFromInboxUrl(inboxUrl: string): string {
  return inboxUrl.replace(new RegExp("inbox$"), "");
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
