import type { NextApiRequest, NextApiResponse } from "next";
import { MockApiOperation } from "../../util/apiDataRetrieval";

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const result = MockApiOperation<"fields">(request, response, "fields");
  response = result;
}
