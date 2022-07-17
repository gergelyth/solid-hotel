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

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <schema:reservationFor> "RoomUrl1";
    <ldp:inbox> "CounterpartyInboxUrl1";
    <schema:reservationAt> "HotelWebId1";
    <schema:owner> "OwnerWebId1";
    <schema:state> 1;
    <schema:checkinTime> "2021-07-03T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <schema:checkoutTime> "2021-07-07T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
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

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/notification> <something:processed> false;
    <something:notificationType> 6;
    <something:createdAt> "${mockDate.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>.
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
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> <schema:fields> "foaf:firstName", "foaf:familyName";
    <schema:reason> "TestReason1";
    <schema:forReservationState> 1;
    <schema:expiry> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <schema:hotelAddressUrl> "https://testpodurl.com/hotelprivacy/testResource1.ttl";
    <schema:datasetUrlTarget> "TestDatasetUrlTarget1";
    <schema:guestInbox> "TestGuestInbox1";
    <schema:reservation> "TestReservationUrl1".
`;

    const dataset = CreateHotelPrivacyTokenDataset(TestHotelPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("CreateGuestPrivacyTokenDataset creates the expected dataset", async () => {
    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/privacy> <schema:fields> "foaf:firstName", "foaf:familyName";
    <schema:reason> "TestReason1";
    <schema:forReservationState> 1;
    <schema:expiry> "2021-07-11T00:00:00.000Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <schema:hotelAddressUrl> "TestUrlAtHotel1";
    <schema:hotelInboxForDeletion> "TestHotelInbox1";
    <schema:hotel> "TestHotelWebId1";
    <schema:reservation> "TestReservationUrl1".
`;

    const dataset = CreateGuestPrivacyTokenDataset(TestGuestPrivacyTokens[0]);
    const serializedResult = await SerializeDataset(dataset);
    expect(serializedResult).toEqual(expectedRdf);
  });
});
