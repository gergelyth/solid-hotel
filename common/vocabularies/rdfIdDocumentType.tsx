import SOLIDHOTEL from "../solidhotel-vocab/SOLIDHOTEL.js";

/** A vocabulary map defining the ID document type to its RDF URL. */
export const IdDocumentTypeToRdf: Record<string, string> = {
  passport: SOLIDHOTEL.PassportIdDocumentType,
  identification_card: SOLIDHOTEL.IdCardIdDocumentType,
};
