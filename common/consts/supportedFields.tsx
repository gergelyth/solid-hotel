import { Field } from "../types/Field";
import { PersonFieldToRdfMap } from "../vocabularies/rdfPerson";
import { xmlSchemaTypes } from "./supportedTypes";

/**
 * The definitions of the support profile fields - specified by the thesis requirements.
 * This is the single entry point of adding a new supported field, however:
 * - if the datatype differs from those already present, one must also implement an input component in {@link FieldInputElementBasedOnType}.
 * - add the new RDF fields definition in {@link PersonFieldToRdfMap}.
 * The reason this is required is to be able to return all supported fields in case we don't want to show only the required ones (e.g. independent SPE).
 * Also to avoid Solid difficulties when we need to retrieve something with a specific type.
 * However, we're making this as an pre-release version since with the further development of Solid we should be able to:
 * - use RDF names instead of the programmatical names
 * - retrieve the RDF label as "pretty" name for each field during initialization
 * - determine the datatype based on the RDF (in case we have well characterized RDF definitions everywhere) - in the worst case, default to string
 * @version 0.1
 */
export default function GetSupportedFields(): Field[] {
  return [
    {
      fieldShortName: "firstName",
      fieldPrettyName: "First name",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["firstName"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "lastName",
      fieldPrettyName: "Last name",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["lastName"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "nationality",
      fieldPrettyName: "Nationality",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["nationality"],
      datatype: xmlSchemaTypes.country,
    },
    {
      fieldShortName: "email",
      fieldPrettyName: "Email",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["email"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "phone",
      fieldPrettyName: "Phone number",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["phone"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "idDocumentType",
      fieldPrettyName: "ID Document Type",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["idDocumentType"],
      datatype: xmlSchemaTypes.idDocumentType,
    },
    {
      fieldShortName: "idDocumentNumber",
      fieldPrettyName: "ID Document Number",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["idDocumentNumber"],
      datatype: xmlSchemaTypes.string,
    },
    {
      fieldShortName: "idDocumentExpiry",
      fieldPrettyName: "ID Document Expiry",
      fieldValue: undefined,
      rdfName: PersonFieldToRdfMap["idDocumentExpiry"],
      datatype: xmlSchemaTypes.dateTime,
    },
  ];
}
