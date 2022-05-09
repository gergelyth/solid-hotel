import {
  getContainedResourceUrlAll,
  getSolidDataset,
  isContainer,
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
import { Session } from "@inrupt/solid-client-authn-browser";

type SerializedDataset = {
  name: string;
  content: string;
};

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
    "bookingrequests/",
    "dataprotection/",
    "hotelprofiles/",
    "privacy/",
    "reservations/",
    "rooms/",
  ];

  const results = await Promise.all(
    foldersOfInterest.map((folder) => {
      const url = coreFolder + folder;
      return RecursivelySerializeDatasets(url, coreFolder, session);
    })
  );
  const flatResults = results.flat(2);
  return "";
}

export async function RecursivelySerializeDatasets(
  currentUrl: string,
  parentUrl: string,
  session: Session
): Promise<SerializedDataset[]> {
  const dataSet = await SafeGetDataset(currentUrl);
  if (!dataSet) {
    return [];
  }

  //in case it's a container
  const urls = getContainedResourceUrlAll(dataSet);
  const childResults = await Promise.all(
    urls.map((childUrl) =>
      RecursivelySerializeDatasets(childUrl, currentUrl, session)
    )
  );
  const results = childResults.flat(5);

  const resultContent = await SerializeDataset(currentUrl, session);
  const result: SerializedDataset = {
    //Return name without the parentUrl and the trailing slash
    name: currentUrl.replace(`${parentUrl}`, "").replace(/\/$/, ""),
    content: resultContent,
  };

  results.unshift(result);
  return results;
}

async function SerializeDataset(
  datasetUrl: string,
  session: Session
): Promise<string> {
  const dataSet = await getSolidDataset(datasetUrl, {
    fetch: session.fetch,
  });
  if (isContainer(dataSet)) {
    return "";
  }

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
    result = r;
  });

  return result;
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
