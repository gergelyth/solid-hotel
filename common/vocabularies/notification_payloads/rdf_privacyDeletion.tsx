/** A vocabulary map defining the RDF properties used for privacy token deletion notifications. */
export const privacyDeletionToRdfMap: Record<string, string> = {
  type: "schema:PrivacyTokenDeletion",
  tokenUrl: "schema:targetDataset",
  guestInboxUrl: "https://schema.org/replyToUrl",
};
