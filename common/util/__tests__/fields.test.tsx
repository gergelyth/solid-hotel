import "@testing-library/jest-dom";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { FieldNameToFieldMap, RdfNameToFieldMap } from "../fields";

describe("fields", () => {
  test("FieldNameToFieldMap contains all supported fields", async () => {
    expect(Object.keys(FieldNameToFieldMap)).toEqual([
      "firstName",
      "lastName",
      "nationality",
      "email",
      "phone",
      "idDocumentType",
      "idDocumentNumber",
      "idDocumentExpiry",
    ]);
  });

  test("RdfNameToFieldMap contains all supported fields", async () => {
    expect(Object.keys(RdfNameToFieldMap)).toEqual([
      personFieldToRdfMap.firstName,
      personFieldToRdfMap.lastName,
      personFieldToRdfMap.nationality,
      personFieldToRdfMap.email,
      personFieldToRdfMap.phone,
      personFieldToRdfMap.idDocumentType,
      personFieldToRdfMap.idDocumentNumber,
      personFieldToRdfMap.idDocumentExpiry,
    ]);
  });
});
