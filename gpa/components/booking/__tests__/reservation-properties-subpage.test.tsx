import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookingPage } from "../../../pages/booking";
import { MockSession } from "../../../../common/util/__tests__/testUtil";
import { ReservationPropertiesPage } from "../reservation-properties-subpage";
import { AddReservation } from "../../../../common/util/solidReservations";
import { ReservationState } from "../../../../common/types/ReservationState";
import { SubmitBookingRequest } from "../../../util/outgoingCommunications";

let bookingPropertiesProps: {
  onSelectAction: (room: string, checkinDate: Date, checkoutDate: Date) => void;
};
jest.mock(
  "../../../../common/components/booking/reservation-properties",
  () => {
    return {
      BookingProperties: jest.fn((props) => {
        bookingPropertiesProps = props;
        return null;
      }),
    };
  }
);
jest.mock("../../../util/outgoingCommunications");
jest.mock("../../../../common/util/solidReservations", () => {
  return {
    AddReservation: jest.fn(() => "TestInboxUrl"),
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    HotelWebId: "HotelWebId",
    RoomDefinitionsUrl: "https://testpodurl.com/rooms/",
  };
});

jest.mock("../../../../common/util/solid", () => {
  return {
    GetSession: jest.fn(() => MockSession(true, "TestWebId")),
  };
});

function Render(
  setCurrentPage: () => void,
  setConfirmReservation: () => void
): RenderResult {
  return render(
    <ReservationPropertiesPage
      currentPage={BookingPage.ReservationProperties}
      setCurrentPage={setCurrentPage}
      setConfirmReservation={setConfirmReservation}
    />
  );
}

describe("<ReservationPropertiesPage />", () => {
  test("Renders correctly and calls components with correct arguments", async () => {
    const checkinDate = new Date();
    const checkoutDate = new Date();

    const setCurrentPage = jest.fn();

    let confirmReservation: () => () => void = jest.fn();
    const setConfirmReservation = jest
      .fn()
      .mockImplementation((confirmFunction) => {
        confirmReservation = confirmFunction;
      });

    const reservationPropertiesSubpage = Render(
      setCurrentPage,
      setConfirmReservation
    );
    expect(reservationPropertiesSubpage).toBeDefined();

    bookingPropertiesProps.onSelectAction(
      "TestRoomId",
      checkinDate,
      checkoutDate
    );

    expect(setCurrentPage).toBeCalledWith(BookingPage.RequiredFields);

    await confirmReservation()();

    expect(AddReservation).toBeCalledWith({
      id: null,
      inbox: null,
      owner: "TestWebId",
      hotel: "HotelWebId",
      room: "https://testpodurl.com/rooms/TestRoomId",
      state: ReservationState.REQUESTED,
      dateFrom: checkinDate,
      dateTo: checkoutDate,
    });

    expect(SubmitBookingRequest).toBeCalledWith({
      id: null,
      inbox: "TestInboxUrl",
      owner: "TestWebId",
      hotel: "HotelWebId",
      room: "https://testpodurl.com/rooms/TestRoomId",
      state: ReservationState.REQUESTED,
      dateFrom: checkinDate,
      dateTo: checkoutDate,
    });
  });
});
