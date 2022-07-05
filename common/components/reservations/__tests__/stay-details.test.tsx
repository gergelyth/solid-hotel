import "@testing-library/jest-dom";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { ReservationState } from "../../../types/ReservationState";
import { GetNightCount, GetStayInterval } from "../stay-details";

const testReservation: ReservationAtHotel = {
  id: "reservationId1",
  inbox: "CounterpartyInboxUrl",
  owner: "OwnerWebId",
  hotel: "HotelWebId",
  room: "RoomUrl",
  state: ReservationState.CONFIRMED,
  dateFrom: new Date("2021-07-03"),
  dateTo: new Date("2021-07-07"),
};

describe("GetNightCount(), GetStayInterval()", () => {
  test("GetNightCount() returns the correct string for a reservation", async () => {
    const nightCountString = GetNightCount(testReservation);
    expect(nightCountString).toEqual("4 nights");
  });

  test("GetStayInterval() returns the correct string for a reservation", async () => {
    const stayIntervalString = GetStayInterval(testReservation);
    expect(stayIntervalString).toEqual("July 3rd, 2021 - July 7th, 2021");
  });
});
