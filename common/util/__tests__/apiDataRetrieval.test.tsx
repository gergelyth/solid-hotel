import { mocked } from "ts-jest/utils";
import "@testing-library/jest-dom";
import { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../apiDataRetrieval";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";

function MockRequest(): NextApiRequest {
  const query: { [key: string]: string } = {
    hotelLocation: "France",
    guestNationality: "English",
  };
  const mockRequest = mocked({
    query: query,
  } as unknown as NextApiRequest);
  return mockRequest;
}

describe("apiDataRetrieval", () => {
  test("MockApiOperation returns correct data", async () => {
    const expectedResult = [
      personFieldToRdfMap.firstName,
      personFieldToRdfMap.lastName,
      personFieldToRdfMap.nationality,
      personFieldToRdfMap.idDocumentNumber,
      personFieldToRdfMap.email,
    ];

    let jsonResult;
    const result = MockApiOperation<"fields">(
      MockRequest(),
      mocked({
        json: jest.fn((json) => {
          jsonResult = json;
        }),
      } as unknown as NextApiResponse),
      "fields"
    );

    expect(result.statusCode).toEqual(200);
    expect(jsonResult).toEqual(expectedResult);
  });
});
