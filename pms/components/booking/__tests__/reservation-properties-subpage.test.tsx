import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookingPage } from "../../../pages/booking";
import { ReservationPropertiesPage } from "../reservation-properties-subpage";
import { AddReservation } from "../../../../common/util/solid_reservations";
import { ReservationState } from "../../../../common/types/ReservationState";
import { ShowSuccessSnackbar } from "../../../../common/components/snackbar";
import { CreateAndSavePairingToken } from "../../../../common/util/pairingTokenHandler";

let bookingPropertiesProps: {
  onSelectAction: (
    room: string,
    checkinDate: Date,
    checkoutDate: Date
  ) => Promise<void>;
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
jest.mock("../../../../common/components/snackbar");
jest.mock("../../../../common/util/pairingTokenHandler");
jest.mock("../../../../common/hooks/useReservations");

jest.mock("../../../../common/util/solid_reservations", () => {
  return {
    AddReservation: jest.fn(
      () => "https://testpodurl.com/reservations/11111111/inbox"
    ),
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    HotelWebId: "HotelWebId",
    RoomDefinitionsUrl: "https://testpodurl.com/rooms/",
  };
});

function Render(setCurrentPage: () => void): RenderResult {
  return render(
    <ReservationPropertiesPage
      currentPage={BookingPage.ReservationProperties}
      setCurrentPage={setCurrentPage}
    />
  );
}

describe("<ReservationPropertiesPage />", () => {
  test("Renders correctly and calls components with correct arguments", async () => {
    const checkinDate = new Date();
    const checkoutDate = new Date();

    const setCurrentPage = jest.fn();

    const reservationPropertiesSubpage = Render(setCurrentPage);
    expect(reservationPropertiesSubpage).toBeDefined();

    await bookingPropertiesProps.onSelectAction(
      "TestRoomId",
      checkinDate,
      checkoutDate
    );

    expect(ShowSuccessSnackbar).toBeCalled();
    expect(setCurrentPage).toBeCalledWith(BookingPage.Finish);

    expect(AddReservation).toBeCalledWith({
      id: null,
      inbox: null,
      owner: "HotelWebId",
      hotel: "HotelWebId",
      room: "https://testpodurl.com/rooms/TestRoomId",
      state: ReservationState.CONFIRMED,
      dateFrom: checkinDate,
      dateTo: checkoutDate,
    });

    expect(CreateAndSavePairingToken).toBeCalledWith(
      "https://testpodurl.com/reservations/11111111/"
    );
  });
});
