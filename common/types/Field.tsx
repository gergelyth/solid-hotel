import { NamedNode } from "rdf-js";

export type Field = {
  fieldShortName: string;
  fieldPrettyName: string;
  fieldValue: string | undefined;
  rdfName: string;
  datatype: NamedNode;
};
