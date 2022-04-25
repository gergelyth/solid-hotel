//have a regex (or url pattern list) where to look for the inboxes - all relative to the pod address core
// TODO: its unintiutive that   "/reservations/*inbox" has to look like that, but it's correct - fix that
export const PMSInboxList: string[] = [
  "/bookingrequests",
  "/reservations/*inbox",
  "/privacy/inbox",
];
