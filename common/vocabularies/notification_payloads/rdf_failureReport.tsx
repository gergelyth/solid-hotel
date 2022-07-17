import { RLOG } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for failure report notifications. */
export const failureReportRdfMap: Record<string, string> = {
  resultState: "https://schema.org/reservationStatus",
  errorMessage: RLOG.message,
};
