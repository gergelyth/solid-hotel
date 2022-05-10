import { fromRdfJsDataset, saveSolidDatasetAt } from "@inrupt/solid-client";
import { GetSession } from "../util/solid";
import {
  Parser,
  Literal,
  Store,
  Quad,
  DataFactory,
  NamedNode,
  DefaultGraph,
} from "n3";
import { xmlSchemaTypes } from "../consts/supportedTypes";
import { addSeconds, differenceInSeconds } from "date-fns";
import JSZip from "jszip";

//TODO unify basedate to one place
const baseDate = new Date(Date.UTC(1970, 0, 1));

export async function Deserialize(): Promise<void> {
  const session = GetSession();

  const zipFile = await fetch("../serialized.zip");
  const zip = await JSZip.loadAsync(zipFile.blob());

  //We can't do anything with prefixes as that's not supported (which is not an issue, it's just ugly when you check the text representation in the Solid Pod UI)
  const parser = new Parser();

  //We can't use the quad parsing overload here for some reason because that results in an empty SolidDataSet
  const quads = parser.parse("");

  const quadStore = new Store();
  for (const quad of quads) {
    const processedQuad = ParseDateOffsetIfRequired(quad as Quad);
    quadStore.addQuad(processedQuad);
  }

  const resultSolidDataset = fromRdfJsDataset(quadStore);
  await saveSolidDatasetAt(
    "https://solidhotel.inrupt.net/bookingrequests/result.ttl",
    resultSolidDataset,
    {
      fetch: session.fetch,
    }
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
