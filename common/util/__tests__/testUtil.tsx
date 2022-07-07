import {
  addUrl,
  createThing,
  mockContainerFrom,
  setThing,
  SolidDataset,
  UrlString,
  WithResourceInfo,
} from "@inrupt/solid-client";

const rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const ldpContainer = "http://www.w3.org/ns/ldp#Container";
const ldpResource = "http://www.w3.org/ns/ldp#Resource";
const ldpContains = "http://www.w3.org/ns/ldp#contains";

export function MockContainer(
  containerUrl: string,
  containedResources: UrlString[]
): SolidDataset & WithResourceInfo {
  let thing = createThing({ url: containerUrl });
  let container = mockContainerFrom(containerUrl);

  containedResources.forEach((resource) => {
    let containedUrls = createThing({
      url: containerUrl + resource,
    });
    containedUrls = addUrl(containedUrls, rdfType, ldpResource);

    thing = addUrl(thing, ldpContains, containedUrls);
    container = setThing(container, containedUrls);
  });

  container = setThing(container, thing);
  thing = addUrl(thing, rdfType, ldpContainer);

  return container;
}
