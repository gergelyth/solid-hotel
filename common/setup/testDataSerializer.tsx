import {
  getContainedResourceUrlAll,
  getSolidDataset,
  toRdfJsDataset,
} from "@inrupt/solid-client";
import { GetSession } from "../util/solid";
import {
  Literal,
  Writer,
  Quad,
  DataFactory,
  NamedNode,
  DefaultGraph,
} from "n3";
import { xmlSchemaTypes } from "../consts/supportedTypes";
import { addSeconds, differenceInSeconds } from "date-fns";
import { ShowErrorSnackbar } from "../components/snackbar";
import { GetCoreFolderFromWebId } from "../util/urlParser";
import { SafeGetDataset } from "../util/solid_wrapper";

const baseDate = new Date(Date.UTC(1970, 0, 1));

export async function Serialize(): Promise<string> {
  const session = GetSession();
  const webId = session.info.webId;
  if (!webId) {
    ShowErrorSnackbar("The user is not logged in!");
    return "";
  }

  const coreFolder = GetCoreFolderFromWebId(webId);
  const foldersOfInterest = [
    "bookingrequests",
    "dataprotection",
    "hotelprofiles",
    "privacy",
    "reservations",
    "rooms",
  ];

  const datasetUrl =
    "https://solidhotel.inrupt.net/bookingrequests/3e0ea330-c405-11ec-b900-d16eff8d0682.ttl";
  const dataSet = await getSolidDataset(datasetUrl, {
    fetch: session.fetch,
  });
  const rdfJsDataset = toRdfJsDataset(dataSet);
  const quadArray = Array.from(rdfJsDataset);

  const writer = new Writer({
    prefixes: { "": "#", xsd: "http://www.w3.org/2001/XMLSchema#" },
  });
  for (const quad of quadArray) {
    const processedQuad = CreateDateOffsetIfRequired(quad as Quad);
    writer.addQuad(processedQuad);
  }

  let result = "";
  writer.end((error, r) => {
    console.log(r);
    result = r;
  });

  return result;
}

type SerializedDataset = {
  name: string;
  content: string;
};

export async function RecursivelySerializeDatasets(
  url: string
): Promise<SerializedDataset[]> {
  const dataSet = await SafeGetDataset(url);
  if (!dataSet) {
    return [];
  }

  //in case it's a container
  const urls = getContainedResourceUrlAll(dataSet);
  await Promise.all(urls.map((url) => RecursivelySerializeDatasets(url)));

  await SafeDeleteDataset(url);
}

function CreateDateOffsetIfRequired(quad: Quad): Quad {
  const literal = quad.object as Literal;
  if (literal === null || !xmlSchemaTypes.dateTime.equals(literal.datatype)) {
    return quad;
  }

  const realDate = Date.parse(literal.value);
  const secondsBetweenThenAndNow = differenceInSeconds(realDate, Date.now());
  const serializedDate = addSeconds(baseDate, secondsBetweenThenAndNow);

  const newLiteral = DataFactory.literal(
    serializedDate.toISOString(),
    literal.datatype
  );
  return new Quad(
    quad.subject as NamedNode,
    quad.predicate as NamedNode,
    newLiteral,
    quad.graph as DefaultGraph
  );
}
