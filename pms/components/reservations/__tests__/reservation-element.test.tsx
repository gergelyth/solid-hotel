import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { CreateReservationElement } from "../reservation-element";
import { ReservationAtHotel } from "../../../../common/types/ReservationAtHotel";
import { ReservationState } from "../../../../common/types/ReservationState";
import { ConciseHotelReservationElement } from "../concise-hotel-reservation";
import { OfflineCheckinButton } from "../../checkin/offline-checkin-button";
import { CancelReservationButton } from "../../../../common/components/cancellation/cancellation";

jest.mock("../concise-hotel-reservation", () => {
  return {
    ConciseHotelReservationElement: jest.fn(() => null),
  };
});
jest.mock("../../../../common/components/cancellation/cancellation", () => {
  return {
    CancelReservationButton: jest.fn(() => null),
  };
});
jest.mock("../../checkin/offline-checkin-button", () => {
  return {
    OfflineCheckinButton: jest.fn(() => null),
  };
});
jest.mock("../../checkin/qr-subpage", () => {
  return {
    QrElementWithHeadings: jest.fn(() => null),
  };
});

function Render(reservation: ReservationAtHotel): RenderResult {
  const reservationElement = CreateReservationElement(
    reservation,
    () => undefined
  );
  return render(reservationElement);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("<CreateReservationElement />", () => {
  test("Confirmed reservation creates correct reservation representation", async () => {
    const reservation = {
      ...TestReservations[0],
      state: ReservationState.CONFIRMED,
    };
    const reservationComponent = Render(reservation);
    expect(reservationComponent).toBeDefined();

    expect(ConciseHotelReservationElement).toBeCalledTimes(1);
    expect(OfflineCheckinButton).toBeCalledTimes(1);
    expect(CancelReservationButton).toBeCalledTimes(1);

    expect(
      reservationComponent.queryByTestId("pairing-qr-button")
    ).not.toBeInTheDocument();
  });

  test("Active unpaired reservation creates correct reservation representation", async () => {
    const reservation = {
      ...TestReservations[0],
      state: ReservationState.ACTIVE,
      inbox: null,
    };
    const reservationComponent = Render(reservation);
    expect(reservationComponent).toBeDefined();

    expect(ConciseHotelReservationElement).toBeCalledTimes(1);
    expect(OfflineCheckinButton).toBeCalledTimes(0);
    expect(CancelReservationButton).toBeCalledTimes(0);

    expect(
      reservationComponent.queryByTestId("pairing-qr-button")
    ).toBeInTheDocument();
  });

  test("Active paired reservation creates correct reservation representation", async () => {
    const reservation = {
      ...TestReservations[0],
      state: ReservationState.ACTIVE,
    };
    const reservationComponent = Render(reservation);
    expect(reservationComponent).toBeDefined();

    expect(ConciseHotelReservationElement).toBeCalledTimes(1);
    expect(OfflineCheckinButton).toBeCalledTimes(0);
    expect(CancelReservationButton).toBeCalledTimes(0);

    expect(
      reservationComponent.queryByTestId("pairing-qr-button")
    ).not.toBeInTheDocument();
  });

  test("Past reservation creates correct reservation representation", async () => {
    const reservation = {
      ...TestReservations[0],
      state: ReservationState.PAST,
    };
    const reservationComponent = Render(reservation);
    expect(reservationComponent).toBeDefined();

    expect(ConciseHotelReservationElement).toBeCalledTimes(1);
    expect(OfflineCheckinButton).toBeCalledTimes(0);
    expect(CancelReservationButton).toBeCalledTimes(0);

    expect(
      reservationComponent.queryByTestId("pairing-qr-button")
    ).not.toBeInTheDocument();
  });
});
