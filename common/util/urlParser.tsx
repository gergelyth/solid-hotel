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
