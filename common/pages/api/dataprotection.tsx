import type { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../../util/apiDataRetrieval";

/**
 * An API method which retrieves the appropriate data protection information based on the guest's nationality and the hotel's country of location.
 * The response contains the JSON return value of the function.
 * Implementation particularies surrounding the calling of the API method itself are handled by NextJS.
 */
export default async function (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const result = MockApiOperation<"dataProtectionInformation">(
    request,
    response,
    "dataProtectionInformation"
  );

  response = result;
}
