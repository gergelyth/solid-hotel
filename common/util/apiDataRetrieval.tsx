import type { NextApiRequest, NextApiResponse } from "next";
import apiData from "../api_data.json";

export type DataProtectionInformation = {
  dataProtectionYears: number;
  dataProtectionFields: string[];
};

type ApiData = {
  nationality: string;
  fields: string[];
  dataProtectionInformation: DataProtectionInformation;
};

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
