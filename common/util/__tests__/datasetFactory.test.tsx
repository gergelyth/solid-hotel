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
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import { ReservationFieldToRdfMap } from "../../vocabularies/rdfReservation";
import { PrivacyTokenToRdfMap } from "../../vocabularies/notificationpayloads/rdfPrivacy";
import { NotificationToRdfMap } from "../../vocabularies/rdfNotification";
import { ReservationStateRdfMap } from "../../vocabularies/rdfReservationStatusTypes";
import { NotificationTypeRdfMap } from "../../vocabularies/notificationpayloads/rdfNotificationTypes";

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

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> a <${
      ReservationFieldToRdfMap.type
    }>;
    <${ReservationFieldToRdfMap.room}> "RoomUrl1";
    <${ReservationFieldToRdfMap.inbox}> "CounterpartyInboxUrl1";
    <${ReservationFieldToRdfMap.hotel}> "HotelWebId1";
    <${ReservationFieldToRdfMap.owner}> "OwnerWebId1";
    <${ReservationFieldToRdfMap.state}> <${
      ReservationStateRdfMap[ReservationState.CONFIRMED]
    }>;
    <${
      ReservationFieldToRdfMap.checkinTime
    }> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${
      ReservationFieldToRdfMap.checkoutTime
    }> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
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

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/notification> a <${
      NotificationToRdfMap.type
    }>;
    <${NotificationToRdfMap.isProcessed}> false;
    <${NotificationToRdfMap.notificationType}> <${
      NotificationTypeRdfMap[NotificationType.PrivacyToken]
    }>;
    <${
      NotificationToRdfMap.createdAt
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
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> a <${PrivacyTokenToRdfMap.type}>;
    <${PrivacyTokenToRdfMap.fieldList}> "${PersonFieldToRdfMap.firstName}", "${PersonFieldToRdfMap.lastName}";
    <${PrivacyTokenToRdfMap.reason}> "TestReason1";
    <${PrivacyTokenToRdfMap.forReservationState}> 1;
    <${PrivacyTokenToRdfMap.expiry}> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${PrivacyTokenToRdfMap.url}> "https://testpodurl.com/hotelprivacy/testResource1.ttl";
    <${PrivacyTokenToRdfMap.datasetUrlTarget}> "TestDatasetUrlTarget1";
    <${PrivacyTokenToRdfMap.guestInbox}> "TestGuestInbox1";
    <${PrivacyTokenToRdfMap.reservation}> "TestReservationUrl1".
`;

    const dataset = CreateHotelPrivacyTokenDataset(TestHotelPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("CreateGuestPrivacyTokenDataset creates the expected dataset", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> a <${PrivacyTokenToRdfMap.type}>;
    <${PrivacyTokenToRdfMap.fieldList}> "${PersonFieldToRdfMap.firstName}", "${PersonFieldToRdfMap.lastName}";
    <${PrivacyTokenToRdfMap.reason}> "TestReason1";
    <${PrivacyTokenToRdfMap.forReservationState}> 1;
    <${PrivacyTokenToRdfMap.expiry}> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <${PrivacyTokenToRdfMap.url}> "TestUrlAtHotel1";
    <${PrivacyTokenToRdfMap.hotelInboxForDeletion}> "TestHotelInbox1";
    <${PrivacyTokenToRdfMap.hotel}> "TestHotelWebId1";
    <${PrivacyTokenToRdfMap.reservation}> "TestReservationUrl1".
`;

    const dataset = CreateGuestPrivacyTokenDataset(TestGuestPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });
});
