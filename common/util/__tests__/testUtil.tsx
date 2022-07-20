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
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import { ISessionInfo, Session } from "@inrupt/solid-client-authn-browser";
import { mocked } from "ts-jest/utils";
import { HotelPrivacyToken } from "../../types/HotelPrivacyToken";
import { GuestPrivacyToken } from "../../types/GuestPrivacyToken";
import { RoomDefinition } from "../../types/RoomDefinition";
import { countryToRdfMap } from "../../vocabularies/rdf_countries";

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

export function MockSession(isLoggedIn?: boolean, webId?: string): Session {
  const sessionInfo: ISessionInfo = {
    isLoggedIn: isLoggedIn ?? true,
    sessionId: "dummy",
    webId: webId,
  };
  const mockSession = mocked({
    info: sessionInfo,
  } as unknown as Session);
  return mockSession;
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
    fieldValue: countryToRdfMap.GBR,
    rdfName: personFieldToRdfMap["nationality"],
    datatype: xmlSchemaTypes.country,
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

export const TestRoomDefinitions: RoomDefinition[] = [
  { id: "roomId1", name: "Room 1", description: "Description 1" },
  { id: "roomId2", name: "Room 2", description: "Description 2" },
  { id: "roomId3", name: "Room 3", description: "Description 3" },
];

export const TestReservations: ReservationAtHotel[] = [
  {
    id: "reservationId1",
    inbox: "CounterpartyInboxUrl1",
    owner: "OwnerWebId1",
    hotel: "HotelWebId1",
    room: "RoomUrl1",
    state: ReservationState.CONFIRMED,
    dateFrom: new Date("2021-07-03"),
    dateTo: new Date("2021-07-07"),
  },
  {
    id: "reservationId2",
    inbox: "CounterpartyInboxUrl2",
    owner: "OwnerWebId2",
    hotel: "HotelWebId2",
    room: "RoomUrl2",
    state: ReservationState.ACTIVE,
    dateFrom: new Date("2021-07-15"),
    dateTo: new Date("2021-07-16"),
  },
];

export const TestHotelPrivacyTokens: HotelPrivacyToken[] = [
  {
    urlAtHotel: "https://testpodurl.com/hotelprivacy/testResource1.ttl",
    fieldList: [personFieldToRdfMap.firstName, personFieldToRdfMap.lastName],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: new Date("2021-07-11"),
    datasetUrlTarget: "TestDatasetUrlTarget1",
    guestInbox: "TestGuestInbox1",
    reservation: "TestReservationUrl1",
  },
  {
    urlAtHotel: "https://testpodurl.com/hotelprivacy/testResource2.ttl",
    fieldList: [personFieldToRdfMap.firstName],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: new Date("2021-07-22"),
    datasetUrlTarget: "TestDatasetUrlTarget2",
    guestInbox: "TestGuestInbox2",
    reservation: "TestReservationUrl2",
  },
];

export const TestGuestPrivacyTokens: GuestPrivacyToken[] = [
  {
    urlAtHotel: "TestUrlAtHotel1",
    fieldList: [personFieldToRdfMap.firstName, personFieldToRdfMap.lastName],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: new Date("2021-07-11"),
    hotelInboxForDeletion: "TestHotelInbox1",
    hotel: "TestHotelWebId1",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource3.ttl",
    reservation: "TestReservationUrl1",
  },
  {
    urlAtHotel: "TestUrlAtHotel2",
    fieldList: [personFieldToRdfMap.firstName],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: new Date("2021-07-22"),
    hotelInboxForDeletion: "TestHotelInbox2",
    hotel: "TestHotelWebId2",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource4.ttl",
    reservation: "TestReservationUrl2",
  },
];

describe("testUtil", () => {
  test("Empty test to avoid error", () => undefined);
});
