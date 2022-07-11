import { NamedNode } from "rdf-js";

/** Contains the guest personal information field definition. */
export type Field = {
  fieldShortName: string;
  fieldPrettyName: string;
  fieldValue: string | undefined;
  rdfName: string;
  datatype: NamedNode;
};
