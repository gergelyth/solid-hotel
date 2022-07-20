import type { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../../util/apiDataRetrieval";

/**
 * An API method which retrieves the appropriate RDF names of the required fields for booking and check-in based on the guest's nationality and the hotel's country of location.
 * The response contains the JSON return value of the function.
 * Implementation particularies surrounding the calling of the API method itself are handled by NextJS.
 */
export default async function (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const result = MockApiOperation<"fields">(request, response, "fields");
  response = result;
}
