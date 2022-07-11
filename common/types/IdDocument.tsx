/** Supporting enum for the guest's ID document type to showcase enum values. */
export enum IdDocumentType {
  PASSPORT,
  IDENTIFICATION_CARD,
}

/** Grouping type for the ID document of the guest. */
export type IdDocument = {
  idDocumentType: IdDocumentType;
  idDocumentNumber: string;
  idDocumentExpiry: Date;
};
