import { mocked } from "ts-jest/utils";
import "@testing-library/jest-dom";
import { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../apiDataRetrieval";

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
      "foaf:firstName",
      "foaf:familyName",
      "schema:nationality",
      "schema:idDocumentNumber",
      "schema:email",
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
