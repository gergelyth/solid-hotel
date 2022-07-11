//have a regex (or url pattern list) where to look for the inboxes - all relative to the pod address core
// TODO: its unintiutive that   "/reservations/*inbox" has to look like that, but it's correct - fix that
/** An array of relative URLs indicating the places we must monitor for incoming notifcations. May include the wildcard * to mean all resources in its place. */
export const GPAInboxList: string[] = ["/reservations/*inbox"];
