import {
  getContainedResourceUrlAll,
  getResourceAcl,
  getSolidDatasetWithAcl,
  isContainer,
  SolidDataset,
  toRdfJsDataset,
  WithResourceInfo,
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
import { Session } from "@inrupt/solid-client-authn-browser";
import JSZip from "jszip";
import { SerializationBaseDate, GetPodBaseUrl, AclFilename } from "./setupUtil";

type SerializedDataset = {
  name: string;
  content: string;
};

export async function Serialize(
  foldersOfInterest: string[]
): Promise<Blob | undefined> {
  const session = GetSession();
  const baseUrl = GetPodBaseUrl(session);
  if (!baseUrl) {
    return;
  }

  const results = await Promise.all(
    foldersOfInterest.map((folder) => {
      const url = baseUrl + folder;
      return RecursivelySerializeDatasets(url, baseUrl, session);
    })
  );
  const flatResults = results.flat(2);

  const zip = new JSZip();
  for (const file of flatResults) {
    zip.file(file.name, file.content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  return content;
}

export async function RecursivelySerializeDatasets(
  currentUrl: string,
  baseUrl: string,
  session: Session
): Promise<SerializedDataset[]> {
  const datasetWithAcl = await getSolidDatasetWithAcl(currentUrl, {
    fetch: session.fetch,
  });

  //in case it's a container
  const urls = getContainedResourceUrlAll(datasetWithAcl);
  const childResults = await Promise.all(
    urls.map((childUrl) =>
      RecursivelySerializeDatasets(childUrl, baseUrl, session)
    )
  );
  const results = childResults.flat(5);
  if (isContainer(datasetWithAcl)) {
    const acl = getResourceAcl(datasetWithAcl);
    if (acl) {
      const aclResult = await CreateSerializedDataset(
        acl,
        `${currentUrl}${AclFilename}`,
        baseUrl
      );
      results.unshift(aclResult);
    }
    return results;
  }

  const result = await CreateSerializedDataset(
    datasetWithAcl,
    currentUrl,
    baseUrl
  );

  results.unshift(result);
  return results;
}

async function CreateSerializedDataset(
  dataset: SolidDataset & WithResourceInfo,
  currentUrl: string,
  baseUrl: string
): Promise<SerializedDataset> {
  const resultContent = await SerializeDataset(dataset);
  const result: SerializedDataset = {
    //Return name without the baseUrl
    name: currentUrl.replace(`${baseUrl}`, ""),
    content: resultContent,
  };

  return result;
}

async function SerializeDataset(
  dataSet: SolidDataset & WithResourceInfo
): Promise<string> {
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
  const serializedDate = addSeconds(
    SerializationBaseDate,
    secondsBetweenThenAndNow
  );

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
