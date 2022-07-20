import "@testing-library/jest-dom";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
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
      PersonFieldToRdfMap.firstName,
      PersonFieldToRdfMap.lastName,
      PersonFieldToRdfMap.nationality,
      PersonFieldToRdfMap.email,
      PersonFieldToRdfMap.phone,
      PersonFieldToRdfMap.idDocumentType,
      PersonFieldToRdfMap.idDocumentNumber,
      PersonFieldToRdfMap.idDocumentExpiry,
    ]);
  });
});
