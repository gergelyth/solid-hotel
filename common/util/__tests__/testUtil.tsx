import {
  addUrl,
  createThing,
  fromRdfJsDataset,
  mockContainerFrom,
  setThing,
  SolidDataset,
  toRdfJsDataset,
  UrlString,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { Parser, Store, Writer } from "n3";
import { xmlSchemaTypes } from "../../consts/supportedTypes";
import { Field } from "../../types/Field";
import { NotificationType } from "../../types/NotificationsType";
import { Notification } from "../../types/Notification";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";

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

export async function SerializeDataset(dataSet: SolidDataset): Promise<string> {
  const rdfJsDataset = toRdfJsDataset(dataSet);
  const quadArray = Array.from(rdfJsDataset);

  const writer = new Writer();
  writer.addQuads(quadArray);

  let result = "";
  writer.end((error, r) => {
    result = r;
  });

  return result;
}

export async function DeserializeDataset(
  content: string
): Promise<SolidDataset> {
  const parser = new Parser();
  const quads = parser.parse(content);

  const quadStore = new Store(quads);
  return fromRdfJsDataset(quadStore);
}

export const TestGuestFields: Field[] = [
  {
    fieldShortName: "firstName",
    fieldPrettyName: "First name",
    fieldValue: "John",
    rdfName: personFieldToRdfMap["firstName"],
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "lastName",
    fieldPrettyName: "Last name",
    fieldValue: "Smith",
    rdfName: personFieldToRdfMap["lastName"],
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: "English",
    rdfName: personFieldToRdfMap["nationality"],
    datatype: xmlSchemaTypes.string,
  },
];

export const TestNotifications: Notification[] = [
  {
    notificationUrl: "TestUrl1",
    isProcessed: true,
    type: NotificationType.BookingRequest,
    text: "TestMessage1",
    createdAt: new Date("2021-07-01 16:33:25"),
    onClick: () => undefined,
    onReceive: () => undefined,
  },
  {
    notificationUrl: "TestUrl2",
    isProcessed: true,
    type: NotificationType.PrivacyToken,
    text: "TestMessage2",
    createdAt: new Date("2021-07-03 12:34:11"),
    onClick: () => undefined,
    onReceive: () => undefined,
  },
];
