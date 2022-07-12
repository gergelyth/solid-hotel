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

/** Helper type which encompasses the name of the Solid resource and the RDF string content. */
type SerializedDataset = {
  name: string;
  content: string;
};

/**
 * Creates a ZIP file of all the datasets contained in the folders of interest.
 * The folders of interest are relative URL paths and are expanded with the default session's Pod URL.
 * Helper function - required by the setup functionality.
 * @returns A ZIP blob with all contained datasets (including ACL) serialized.
 */
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

/**
 * Serializes the dataset recursively.
 * If the dataset is a container, it calls this method on all contained items.
 * Helper function - required by the setup functionality.
 * @returns All contained datasets (including ACL) serialized with names.
 */
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

/**
 * Serializes the Solid dataset into an RDF string and parses the name according to the URL.
 * Helper function - required by the setup functionality.
 * @returns The RDF string describing the Solid dataset and its resource name.
 */
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

/**
 * Serializes the Solid dataset into an RDF string.
 * Helper function - required by the setup functionality.
 * @returns The RDF string describing the Solid dataset.
 */
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

/**
 * Parses the date from the RDF quad, calculates the offset relative to the current date and adds the difference to the base date.
 * We produce a relative date according to the base date this way - this will then allow us to deserialize in a similar fashion to get a relative date as well.
 * Helper function - required by the setup functionality.
 * @returns An RDF quad with relative date.
 */
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
