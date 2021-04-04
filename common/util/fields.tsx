import GetSupportedFields from "../consts/supported-fields";
import { Field } from "../types/Field";

type FieldMap = Record<string, Field>;

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

export const {
  FieldNameToFieldMap,
  RdfNameToFieldMap,
}: { FieldNameToFieldMap: FieldMap; RdfNameToFieldMap: FieldMap } = CreateMap();
