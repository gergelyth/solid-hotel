import "@testing-library/jest-dom";
import { ReservationAtHotel } from "../../types/ReservationAtHotel";
import { ReservationState } from "../../types/ReservationState";
import {
  AddNotificationThingToDataset,
  CreateGuestPrivacyTokenDataset,
  CreateHotelPrivacyTokenDataset,
  CreateReservationDataset,
} from "../datasetFactory";
import { createSolidDataset } from "@inrupt/solid-client";
import { NotificationType } from "../../types/NotificationsType";
import {
  SerializeDataset,
  TestGuestPrivacyTokens,
  TestHotelPrivacyTokens,
} from "./testUtil";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { reservationFieldToRdfMap } from "../../vocabularies/rdf_reservation";
import { privacyTokenToRdfMap } from "../../vocabularies/notification_payloads/rdf_privacy";
import { notificationToRdfMap } from "../../vocabularies/rdf_notification";

describe("datasetFactory", () => {
  test("CreateReservationDataset creates the expected dataset", async () => {
    const reservation: ReservationAtHotel = {
      id: "reservationId1",
      inbox: "CounterpartyInboxUrl1",
      owner: "OwnerWebId1",
      hotel: "HotelWebId1",
      room: "RoomUrl1",
      state: ReservationState.CONFIRMED,
      dateFrom: new Date("2021-07-03"),
      dateTo: new Date("2021-07-07"),
    };

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.room}> "RoomUrl1";
    <${reservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${reservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${reservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${reservationFieldToRdfMap.state}> 1;
    <${reservationFieldToRdfMap.checkinTime}> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${reservationFieldToRdfMap.checkoutTime}> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
`;

    const dataset = CreateReservationDataset(reservation);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("AddNotificationThingToDataset creates the expected dataset", async () => {
    const mockDate = new Date("2021-08-22 15:33:21");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/notification> <${
      notificationToRdfMap.isProcessed
    }> false;
    <${notificationToRdfMap.notificationType}> 6;
    <${
      notificationToRdfMap.createdAt
    }> "${mockDate.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
`;

    const dataset = AddNotificationThingToDataset(
      createSolidDataset(),
      NotificationType.PrivacyToken
    );
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);

    jestDateSpy.mockRestore();
  });

  test("CreateHotelPrivacyTokenDataset creates the expected dataset", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> <${privacyTokenToRdfMap.fieldList}> "${personFieldToRdfMap.firstName}", "${personFieldToRdfMap.lastName}";
    <${privacyTokenToRdfMap.reason}> "TestReason1";
    <${privacyTokenToRdfMap.forReservationState}> 1;
    <${privacyTokenToRdfMap.expiry}> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${privacyTokenToRdfMap.url}> "https://testpodurl.com/hotelprivacy/testResource1.ttl";
    <${privacyTokenToRdfMap.datasetUrlTarget}> "TestDatasetUrlTarget1";
    <${privacyTokenToRdfMap.guestInbox}> "TestGuestInbox1";
    <${privacyTokenToRdfMap.reservation}> "TestReservationUrl1".
`;

    const dataset = CreateHotelPrivacyTokenDataset(TestHotelPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("CreateGuestPrivacyTokenDataset creates the expected dataset", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> <${privacyTokenToRdfMap.fieldList}> "${personFieldToRdfMap.firstName}", "${personFieldToRdfMap.lastName}";
    <${privacyTokenToRdfMap.reason}> "TestReason1";
    <${privacyTokenToRdfMap.forReservationState}> 1;
    <${privacyTokenToRdfMap.expiry}> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${privacyTokenToRdfMap.url}> "TestUrlAtHotel1";
    <${privacyTokenToRdfMap.hotelInboxForDeletion}> "TestHotelInbox1";
    <${privacyTokenToRdfMap.hotel}> "TestHotelWebId1";
    <${privacyTokenToRdfMap.reservation}> "TestReservationUrl1".
`;

    const dataset = CreateGuestPrivacyTokenDataset(TestGuestPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });
});
