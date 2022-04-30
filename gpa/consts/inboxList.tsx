//have a regex (or url pattern list) where to look for the inboxes - all relative to the pod address core
// TODO: its unintiutive that   "/reservations/*inbox" has to look like that, but it's correct - fix that
export const GPAInboxList: string[] = [
  "/reservations/*inbox",
  // privacy inbox is there for when the hotel makes a change on its own volition (i.e. anynomizes webId during check-in since it no longer needs it)
  "/privacy/inbox",
];
