import "@testing-library/jest-dom";
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
      "foaf:firstName",
      "foaf:familyName",
      "schema:nationality",
      "schema:email",
      "schema:phone_number",
      "schema:idDocumentType",
      "schema:idDocumentNumber",
      "schema:idDocumentExpiry",
    ]);
  });
});
