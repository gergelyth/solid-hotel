import SOLIDHOTEL from "../../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the RDF properties used for privacy token deletion notifications. */
export const PrivacyDeletionToRdfMap: Record<string, string> = {
  type: SOLIDHOTEL.PrivacyTokenDeletion,
  tokenUrl: SOLIDHOTEL.targetDataset,
  guestInboxUrl: "https://schema.org/replyToUrl",
};
