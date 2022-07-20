import { mocked } from "ts-jest/utils";
import "@testing-library/jest-dom";
import { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../apiDataRetrieval";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import { CountryToRdfMap } from "../../vocabularies/rdfCountries";

function MockRequest(): NextApiRequest {
  const query: { [key: string]: string } = {
    hotelLocation: CountryToRdfMap.FRA,
    guestNationality: CountryToRdfMap.GBR,
  };
  const mockRequest = mocked({
    query: query,
  } as unknown as NextApiRequest);
  return mockRequest;
}

describe("apiDataRetrieval", () => {
  test("MockApiOperation returns correct data", async () => {
    const expectedResult = [
      PersonFieldToRdfMap.firstName,
      PersonFieldToRdfMap.lastName,
      PersonFieldToRdfMap.nationality,
      PersonFieldToRdfMap.idDocumentNumber,
      PersonFieldToRdfMap.email,
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
