import { RLOG } from "@inrupt/vocab-common-rdf";

/** A vocabulary map defining the RDF properties used for failure report notifications. */
export const FailureReportRdfMap: Record<string, string> = {
  type: RLOG.Entry.value,
  resultState: "https://schema.org/reservationStatus",
  errorMessage: RLOG.message.value,
};
