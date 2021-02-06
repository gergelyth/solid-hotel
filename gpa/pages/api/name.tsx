//OBSOLETE - kept only as API reference

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GetField } from "../../util/solid";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const firstName = await GetField(personFieldToRdfMap.firstName);
  res.statusCode = 200;
  res.json({ name: firstName });
}
