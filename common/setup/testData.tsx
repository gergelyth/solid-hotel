import {
  fromRdfJsDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  toRdfJsDataset,
} from "@inrupt/solid-client";
import { GetSession } from "../util/solid";
import {
  Parser,
  Literal,
  Store,
  Writer,
  Quad,
  DataFactory,
  NamedNode,
  DefaultGraph,
} from "n3";
import { xmlSchemaTypes } from "../consts/supportedTypes";
import { addSeconds, differenceInSeconds } from "date-fns";

const baseDate = new Date(Date.UTC(1970, 0, 1));

export async function Serialize(): Promise<string> {
  const session = GetSession();

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

export async function Deserialize(): Promise<void> {
  const session = GetSession();

  const file = await fetch("../serialized.txt").then((r) => r.text());

  console.log(file);
  const parser = new Parser();

  //TODO do something with prefixes
  const quads = parser.parse(file, undefined, (prefix, prefixNode) => {
    console.log(prefix, prefixNode);
  });

  const quadStore = new Store();
  for (const quad of quads) {
    const processedQuad = ParseDateOffsetIfRequired(quad as Quad);
    quadStore.addQuad(processedQuad);
  }

  const resultSolidDataset = fromRdfJsDataset(quadStore);
  console.log(resultSolidDataset);
  await saveSolidDatasetAt(
    "https://solidhotel.inrupt.net/bookingrequests/result.ttl",
    resultSolidDataset,
    {
      fetch: session.fetch,
    }
  );
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

function ParseDateOffsetIfRequired(quad: Quad): Quad {
  const literal = quad.object as Literal;
  if (literal === null || !xmlSchemaTypes.dateTime.equals(literal.datatype)) {
    return quad;
  }

  const parsedDate = Date.parse(literal.value);
  const parsedSeconds = differenceInSeconds(parsedDate, baseDate);
  const realDate = addSeconds(new Date(), parsedSeconds);

  const newLiteral = DataFactory.literal(
    realDate.toISOString(),
    literal.datatype
  );
  return new Quad(
    quad.subject as NamedNode,
    quad.predicate as NamedNode,
    newLiteral,
    quad.graph as DefaultGraph
  );
}
