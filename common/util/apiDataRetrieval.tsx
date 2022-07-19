import type { NextApiRequest, NextApiResponse } from "next";
import apiData from "../api_data.json";

/** A helper type containing the data protection properties (how long to store what fields) */
export type DataProtectionInformation = {
  dataProtectionStorageDuration: {
    years: number;
    months: number;
    days: number;
  };
  dataProtectionFields: string[];
};

/** A helper type containing all information parseable from the JSON file. */
type ApiData = {
  nationality: string;
  fields: string[];
  dataProtectionInformation: DataProtectionInformation;
};

/**
 * Find the appropriate entry in the JSON file matching the guest's nationality and the hotel's country.
 * @returns The entry for the the combination of arguments or undefined if no such entry exists.
 */
function GetData(
  hotelLocation: string,
  guestNationality: string
): ApiData | undefined {
  const hotelElement = apiData.personalInformationRequirements.find(
    (item) => item.hotelLocation === hotelLocation
  );

  if (!hotelElement) {
    return;
  }

  const nationalityElement = hotelElement.requirements.find(
    (item) => item.nationality === guestNationality
  );

  return nationalityElement;
}

/**
 * Parses the query parameters from the request to get the guest's nationality and the hotel's location.
 * Looks up the appropriate entry in the static JSON file and returns it to the user.
 * @returns The appropriate matching entry in JSON format set in the response argument.
 */
export function MockApiOperation<ApiDataElement extends keyof ApiData>(
  request: NextApiRequest,
  response: NextApiResponse,
  requestedElement: ApiDataElement
): NextApiResponse {
  let hotelLocation = request.query["hotelLocation"];
  if (Array.isArray(hotelLocation)) {
    hotelLocation = hotelLocation[0];
  }

  let guestNationality = request.query["guestNationality"];
  if (Array.isArray(guestNationality)) {
    guestNationality = guestNationality[0];
  }

  const data = GetData(hotelLocation, guestNationality);
  if (!data) {
    response.statusCode = 404;
    response.json({});

    return response;
  }

  const result = data[requestedElement];
  response.statusCode = 200;
  response.json(result);

  return response;
}
