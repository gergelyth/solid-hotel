export enum IdDocumentType {
  PASSPORT,
  IDENTIFICATION_CARD,
}

export type IdDocument = {
  idDocumentType: IdDocumentType;
  idDocumentNumber: string;
  idDocumentExpiry: Date;
};

export type Guest = {
  webId: string;
  firstName: string;
  lastName: string;
  nationality: string | null;
  idDocument: IdDocument;
  email: string | null;
  phoneNumber: string;
};
