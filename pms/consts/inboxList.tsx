/**
 * An array of relative URLs indicating the places we must monitor for incoming notifcations. May include the wildcard * to mean all resources in its place.
 * Contains regexes (or url pattern lists) where to look for the inboxes - all relative to the pod address core
 */
export const PMSInboxList: string[] = [
  "/bookingrequests",
  "/reservations/*inbox",
  "/privacy/inbox",
];
