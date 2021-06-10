import {
  getContainedResourceUrlAll,
  getSolidDataset,
  saveSolidDatasetAt,
  setBoolean,
  setThing,
  SolidDataset,
  Thing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { useNotifications } from "../hooks/useNotifications";
import { notificationToRdfMap } from "../vocabularies/rdf_notification";
import { Notification } from "../types/Notification";
import { NotFoundError } from "./errors";
import { GetSession } from "./solid";
import { ParserList } from "../types/ParserList";

async function GlobSolidUrlPaths(
  urlRegex: string,
  resourceCache: { [url: string]: string[] },
  session: Session = GetSession()
): Promise<string[]> {
  const result: string[] = [];

  if (urlRegex.indexOf("*") === -1) {
    result.push(urlRegex);
    return result;
  }

  const [firstPart, lastPart] = [
    urlRegex.slice(0, urlRegex.indexOf("*")),
    urlRegex.slice(urlRegex.indexOf("*") + 1),
  ];

  let containedResources: string[];
  //TODO not sure if this is efficient
  if (firstPart in resourceCache) {
    containedResources = resourceCache[firstPart];
  } else {
    const dataSet = await getSolidDataset(firstPart, {
      fetch: session.fetch,
    });
    if (!dataSet) {
      throw new NotFoundError(`Dataset at ${firstPart} not found.`);
    }
    containedResources = getContainedResourceUrlAll(dataSet);
    resourceCache[firstPart] = containedResources;
  }

  containedResources.forEach((resource) => {
    const firstGlob = resource + lastPart;
    const fullUrls = GlobSolidUrlPaths(firstGlob, resourceCache, session);
    result.push.apply(fullUrls);
  });

  return result;
}

export function RetrieveAllNotifications(
  coreUrl: string,
  inboxRegexList: string[],
  parsers: ParserList
): {
  items: (Notification | null)[];
  isLoading: boolean;
  isError: boolean;
} {
  //TODO put this logic in static render so it's not calculated everytime, just on startup
  const urlPaths: string[] = [];
  const resourceCache: { [url: string]: string[] } = {};
  inboxRegexList.forEach((inboxRegex) => {
    const fullUrl = coreUrl + inboxRegex;
    if (inboxRegex.includes("*")) {
      urlPaths.push.apply(GlobSolidUrlPaths(fullUrl, resourceCache));
    } else {
      urlPaths.push(fullUrl);
    }
  });

  return useNotifications(urlPaths, parsers);
}

export async function SetIsProcessedForNotification(
  datasetUrl: string,
  notificationDataset: SolidDataset,
  notification: Thing,
  session: Session = GetSession()
): Promise<void> {
  notification = setBoolean(
    notification,
    notificationToRdfMap.isProcessed,
    true
  );
  const updatedDataSet = setThing(notificationDataset, notification);

  await saveSolidDatasetAt(datasetUrl, updatedDataSet, {
    fetch: session.fetch,
  });
}
