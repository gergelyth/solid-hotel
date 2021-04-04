import { Field } from "../types/Field";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";
import { xmlSchemaTypes } from "./supportedTypes";

//TODO we should see if there is a "schema:label" or similar for these RDF names and then we could generalize this even more
//by just mapping the datatype of the Literal to the Typescript type
//TODO the reason this is required is so that we know the types of these fields and also to return alll supported types in case we don't want
//to show the only the requireds (in SPE if used independently, we can use all fields) - we could make a field in the JSON which lists all required fields
//for some default key and we could also specify types in that json - that would make this file irrelevant (if also the pretty names can be sourced from some
//description field)
export default function GetSupportedFields(): Field[] {
  return [
    {
      fieldShortName: "firstName",
      fieldPrettyName: "First name",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["firstName"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "lastName",
      fieldPrettyName: "Last name",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["lastName"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "nationality",
      fieldPrettyName: "Nationality",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["nationality"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "email",
      fieldPrettyName: "Email",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["email"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "phone",
      fieldPrettyName: "Phone number",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["phone"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "idDocumentType",
      fieldPrettyName: "ID Document Type",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["idDocumentType"],
      datatype: xmlSchemaTypes.idDocumentType,
    },
    {
      fieldShortName: "idDocumentNumber",
      fieldPrettyName: "ID Document Number",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["idDocumentNumber"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "idDocumentExpiry",
      fieldPrettyName: "ID Document Expiry",
      fieldValue: undefined,
      rdfName: personFieldToRdfMap["idDocumentExpiry"],
      datatype: xmlSchemaTypes.dateTime,
    },
  ];
}
