import GetSupportedFields from "../consts/supported-fields";
import { Field } from "../types/Field";

/** A helper object to avoid doing the field parsing twice. */
type FieldMap = Record<string, Field>;

/**
 * Iterates the supported field definitions taken from {@link GetSupportedFields} and creates two mappings for them.
 * @returns A map where the key is the programmatical name of the field and a map where the key is the RDF name of the field.
 */
function CreateMap(): {
  FieldNameToFieldMap: FieldMap;
  RdfNameToFieldMap: FieldMap;
} {
  const supportedFields = GetSupportedFields();

  const fieldNameToFieldMap: FieldMap = {};
  const rdfNameToFieldMap: FieldMap = {};

  supportedFields.forEach((field) => {
    fieldNameToFieldMap[field.fieldShortName] = field;
    rdfNameToFieldMap[field.rdfName] = field;
  });

  return {
    FieldNameToFieldMap: fieldNameToFieldMap,
    RdfNameToFieldMap: rdfNameToFieldMap,
  };
}

/**
 * {@link FieldNameToFieldMap} maps the programmatical name of the field to the field definition
 * {@link RdfNameToFieldMap} maps the RDF name of the field to the field definition
 */
export const {
  FieldNameToFieldMap,
  RdfNameToFieldMap,
}: { FieldNameToFieldMap: FieldMap; RdfNameToFieldMap: FieldMap } = CreateMap();
