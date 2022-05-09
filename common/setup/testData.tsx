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

export async function Serialize(): Promise<void> {
  const session = GetSession();

  const datasetUrl =
    "https://solidhotel.inrupt.net/bookingrequests/3e0ea330-c405-11ec-b900-d16eff8d0682.ttl";
  const dataSet = await getSolidDataset(datasetUrl, {
    fetch: session.fetch,
  });
  const rdfJsDataset = toRdfJsDataset(dataSet);
  const quadArray = Array.from(rdfJsDataset);

  console.log(quadArray);

  const writer = new Writer({
    prefixes: { "": "#", xsd: "http://www.w3.org/2001/XMLSchema#" },
  });
  const baseDate = new Date(Date.UTC(1970, 0, 1));
  for (let quad of quadArray) {
    const literal = quad.object as Literal;
    if (literal !== null && xmlSchemaTypes.dateTime.equals(literal.datatype)) {
      const realDate = Date.parse(literal.value);
      console.log(realDate);
      const secondsBetweenThenAndNow = differenceInSeconds(
        realDate,
        Date.now()
      );
      console.log(secondsBetweenThenAndNow);
      const serializedDate = addSeconds(baseDate, secondsBetweenThenAndNow);
      console.log(serializedDate);
      const parsedSeconds = differenceInSeconds(serializedDate, baseDate);
      const parsedDate = addSeconds(new Date(), parsedSeconds);

      const newLiteral = DataFactory.literal(
        serializedDate.toISOString(),
        literal.datatype
      );
      quad = new Quad(
        quad.subject as NamedNode,
        quad.predicate as NamedNode,
        newLiteral,
        quad.graph as DefaultGraph
      );
    }

    writer.addQuad(quad);
  }
  let result = "";
  writer.end((error, r) => {
    result = r;
    console.log(result);
  });

  const parser = new Parser();
  const quadStore = new Store();
  parser.parse(result, (error, quad, pref) => {
    if (quad) quadStore.addQuad(quad);
    else console.log("Do something with prefixes", pref);
  });

  const resultSolidDataset = fromRdfJsDataset(quadStore);
  await saveSolidDatasetAt(
    "https://solidhotel.inrupt.net/bookingrequests/result.ttl",
    resultSolidDataset,
    {
      fetch: session.fetch,
    }
  );
}
