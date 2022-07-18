import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  HotelToRdf,
  TrackedRdfFieldCollector,
} from "../trackedRdfFieldCollector";
import { useGuestPrivacyTokens } from "../../../common/hooks/usePrivacyTokens";
import { TestReservations } from "../../../common/util/__tests__/testUtil";
import { useReservations } from "../../../common/hooks/useReservations";
import { GuestPrivacyToken } from "../../../common/types/GuestPrivacyToken";
import { personFieldToRdfMap } from "../../../common/vocabularies/rdf_person";
import { ReservationState } from "../../../common/types/ReservationState";
import { GetTomorrow } from "../../../common/util/helpers";

const testTokens: GuestPrivacyToken[] = [
  {
    urlAtHotel: "TestUrlAtHotel1",
    fieldList: [personFieldToRdfMap.phone, personFieldToRdfMap.lastName],
    reason: "TestReason1",
    forReservationState: ReservationState.CONFIRMED,
    expiry: GetTomorrow(),
    hotelInboxForDeletion: "TestHotelInbox1",
    hotel: "HotelWebId2",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource3.ttl",
    reservation: "TestReservationUrl1",
  },
  {
    urlAtHotel: "TestUrlAtHotel2",
    fieldList: [personFieldToRdfMap.firstName],
    reason: "TestReason2",
    forReservationState: ReservationState.ACTIVE,
    expiry: GetTomorrow(),
    hotelInboxForDeletion: "TestHotelInbox2",
    hotel: "HotelWebId2",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource4.ttl",
    reservation: "TestReservationUrl2",
  },
  {
    urlAtHotel: "TestUrlAtHotel3",
    fieldList: [personFieldToRdfMap.firstName, personFieldToRdfMap.email],
    reason: "TestReason3",
    forReservationState: ReservationState.ACTIVE,
    expiry: GetTomorrow(),
    hotelInboxForDeletion: "TestHotelInbox2",
    hotel: "HotelWebId2",
    urlAtGuest: "https://testpodurl.com/guestprivacy/testResource5.ttl",
    reservation: "TestReservationUrl3",
  },
];

jest.mock("../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});
jest.mock("../../../common/components/snackbar");
jest.mock("../../../common/util/solid", () => {
  return {
    GetUserPrivacyPodUrl: () => "TestGuestPrivacyContainer",
  };
});
jest.mock("../../../common/util/solid_reservations", () => {
  return {
    GetUserReservationsPodUrl: () => "TestReservationContainer",
  };
});

jest.mock("../../../common/hooks/useReservations", () => {
  return {
    useReservations: jest.fn(),
  };
});
jest.mock("../../../common/hooks/usePrivacyTokens", () => {
  return {
    useGuestPrivacyTokens: jest.fn(),
  };
});

function Render(setHotelToRdfMap: () => void): RenderResult {
  return render(
    <TrackedRdfFieldCollector
      snackbarId={"TestSnackbarId"}
      setHotelToRdfMap={setHotelToRdfMap}
    />
  );
}

describe("<TrackedRdfFieldCollector />", () => {
  test("Collects correct tracked Rdf fields", async () => {
    (useGuestPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: testTokens,
        isLoading: false,
        isError: false,
      };
    });
    (useReservations as jest.Mock).mockImplementation(() => {
      return {
        items: TestReservations,
        isLoading: false,
        isError: false,
      };
    });

    const setHotelToRdfMap = jest.fn();
    const trackedRdfCollectionSnackbar = Render(setHotelToRdfMap);
    expect(trackedRdfCollectionSnackbar).toBeDefined();

    const expectedHotelToRdf: HotelToRdf = {};
    expectedHotelToRdf["HotelWebId2"] = new Set<string>([
      personFieldToRdfMap.firstName,
      personFieldToRdfMap.email,
    ]);

    expect(setHotelToRdfMap).toBeCalledWith(expectedHotelToRdf);
  });
});
