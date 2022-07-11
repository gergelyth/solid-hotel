import {
  createContainerAt,
  fromRdfJsDataset,
  getSolidDatasetWithAcl,
  hasAccessibleAcl,
  saveAclFor,
  saveSolidDatasetAt,
  SolidDataset,
} from "@inrupt/solid-client";
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
import { Session } from "@inrupt/solid-client-authn-browser";
import {
  SerializationBaseDate,
  GetPodBaseUrl,
  AclFileRegex,
  AclFilename,
} from "./setupUtil";
import { ShowError } from "../util/helpers";

/**
 * Deserializes the given test data contained in a ZIP file with the passed filename.
 * Helper function - required by the setup functionality.
 */
export async function Deserialize(filename: string): Promise<void[]> {
  const session = GetSession();
  const baseUrl = GetPodBaseUrl(session);
  if (!baseUrl) {
    return [];
  }

  const zipFile = await fetch(`../${filename}`);
  const zip = await JSZip.loadAsync(zipFile.blob());

  const promises: Promise<void>[] = [];
  for (const filename in zip.files) {
    const fileObject = zip.files[filename];
    if (fileObject.dir) {
      continue;
    }

    const resultPromise = fileObject
      .async("string")
      .then((content) =>
        DeserializeAndSaveDataset(session, baseUrl, filename, content)
      );

    promises.push(resultPromise);
  }

  return Promise.all(promises);
}

/**
 * Deserializes and saves one dataset from the given RDF string with the given name.
 * The dataset is saved in the Pod whose URL is passed to this function.
 * Helper function - required by the setup functionality.
 */
async function DeserializeAndSaveDataset(
  session: Session,
  baseUrl: string,
  name: string,
  content: string
): Promise<void> {
  //We can't do anything with prefixes as that's not supported (which is not an issue, it's just ugly when you check the text representation in the Solid Pod UI)
  const parser = new Parser();
  //We can't use the quad parsing overload here for some reason because that results in an empty SolidDataSet
  const quads = parser.parse(content);

  const quadStore = new Store();
  for (const quad of quads) {
    const processedQuad = ParseDateOffsetIfRequired(quad as Quad);
    quadStore.addQuad(processedQuad);
  }

  const resultSolidDataset = fromRdfJsDataset(quadStore);

  const url = baseUrl + name;
  if (url.match(AclFileRegex)) {
    const containerUrl = url.replace(AclFilename, "");
    await HandleAclFile(containerUrl, resultSolidDataset, session);
    return;
  }

  await saveSolidDatasetAt(url, resultSolidDataset, {
    fetch: session.fetch,
  });
}

/**
 * Saves the deserialized ACL file for the given container.
 * Helper function - required by the setup functionality.
 */
async function HandleAclFile(
  containerUrl: string,
  aclDataset: SolidDataset,
  session: Session
): Promise<void> {
  await createContainerAt(containerUrl, {
    fetch: session.fetch,
  });
  const datasetWithAcl = await getSolidDatasetWithAcl(containerUrl, {
    fetch: session.fetch,
  });

  if (!hasAccessibleAcl(datasetWithAcl)) {
    ShowError(
      `Retrieved dataset ${containerUrl} does not have accessible ACL file`,
      true
    );
    return;
  }

  await saveAclFor(datasetWithAcl, aclDataset, { fetch: session.fetch });
}

/**
 * Parses the date from the RDF quad, calculates the offset relative to the base date and adds the difference to the current date.
 * We produce a relative date according to the current one this way.
 * Helper function - required by the setup functionality.
 * @returns A quad with a date relative to the current date.
 */
function ParseDateOffsetIfRequired(quad: Quad): Quad {
  const literal = quad.object as Literal;
  if (literal === null || !xmlSchemaTypes.dateTime.equals(literal.datatype)) {
    return quad;
  }

  const parsedDate = Date.parse(literal.value);
  const parsedSeconds = differenceInSeconds(parsedDate, SerializationBaseDate);
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
