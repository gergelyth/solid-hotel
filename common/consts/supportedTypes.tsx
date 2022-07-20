import { NamedNode, Term } from "rdf-js";

/**
 * Helper class inheriting from NamedNode, which takes care of handling equality.
 */
export class SchemaType implements NamedNode<string> {
  termType!: "NamedNode";
  value: string;

  constructor(iri: string) {
    this.value = iri;
  }

  equals(other: Term | null | undefined): boolean {
    if (!other) {
      return false;
    }
    return other.termType === "NamedNode" && other.value === this.value;
  }
}

/**
 * Currently supported data types for fields.
 * If a new type is added, make sure to add a corresponding element handling that type in {@link FieldInputElementBasedOnType}.
 */
export const xmlSchemaTypes = {
  dateTime: new SchemaType("http://www.w3.org/2001/XMLSchema#dateTime"),
  integer: new SchemaType("http://www.w3.org/2001/XMLSchema#integer"),
  string: new SchemaType("http://www.w3.org/2001/XMLSchema#string"),
  idDocumentType: new SchemaType("solidhotel:idDocumentTypeEnum"),
  country: new SchemaType(
    "http://publications.europa.eu/resource/dataset/country"
  ),
};
