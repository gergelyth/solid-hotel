import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CheckinPage } from "../../../pages/reservations/[id]";
import userEvent from "@testing-library/user-event";
import { ReservationAtHotel } from "../../../../common/types/ReservationAtHotel";
import { ReservationDetailsPage } from "../reservation-detail-subpage";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import {
  SubmitCancellationRequest,
  SubmitCheckinRequest,
} from "../../../util/outgoingCommunications";

let cancelReservationButtonProps: {
  reservation: ReservationAtHotel | undefined;
  confirmCancellation: (reservation: ReservationAtHotel) => void;
};
jest.mock("../../../../common/components/cancellation/cancellation", () => {
  return {
    CancelReservationButton: jest.fn((props) => {
      cancelReservationButtonProps = props;
      return null;
    }),
  };
});

let reservationDetailsProps: {
  reservationId: string | undefined;
  setCurrentReservation: (reservation: ReservationAtHotel | undefined) => void;
};
jest.mock("../reservation-details", () => {
  return {
    ReservationDetails: jest.fn((props) => {
      reservationDetailsProps = props;
      return null;
    }),
  };
});

jest.mock("../../../util/outgoingCommunications");

function Render(
  setExecuteCheckin: () => () => void,
  setCurrentPage: () => void
): RenderResult {
  return render(
    <ReservationDetailsPage
      reservationId={"TestId"}
      setExecuteCheckin={setExecuteCheckin}
      currentPage={CheckinPage.ReservationDetail}
      setCurrentPage={setCurrentPage}
    />
  );
}

describe("<ReservationDetailsPage />", () => {
  test("Renders correctly and calls components with correct arguments", async () => {
    const setCurrentPage = jest.fn();

    let executeCheckin: () => () => void = jest.fn();
    const setExecuteCheckin = jest
      .fn()
      .mockImplementation((checkinFunction) => {
        executeCheckin = checkinFunction;
      });

    const reservationDetailsPage = Render(setExecuteCheckin, setCurrentPage);
    expect(reservationDetailsPage).toBeDefined();

    const checkinButton = reservationDetailsPage.queryByTestId(
      "checkin-button"
    ) as Element;
    expect(checkinButton).toBeDisabled();

    act(() => {
      reservationDetailsProps.setCurrentReservation(TestReservations[0]);
    });

    expect(checkinButton).toBeEnabled();

    await userEvent.click(checkinButton);

    expect(setCurrentPage).toBeCalledWith(CheckinPage.RequiredFields);

    executeCheckin()();
    expect(SubmitCheckinRequest).toBeCalledWith(TestReservations[0]);

    cancelReservationButtonProps.confirmCancellation(TestReservations[1]);
    expect(SubmitCancellationRequest).toBeCalledWith(TestReservations[1]);
  });
});
