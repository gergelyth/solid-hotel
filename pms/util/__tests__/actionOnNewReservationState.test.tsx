import { act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DoOnStateChange } from "../actionOnNewReservationState";
import { ReservationState } from "../../../common/types/ReservationState";
import { SetReservationStateAndInbox } from "../../../common/util/solidReservations";
import { ConfirmReservationStateRequest } from "../outgoingCommunications";
import { ShowCustomSnackbar } from "../../../common/components/snackbar";

jest.mock("../../../common/util/solidReservations", () => {
  return {
    GetOwnerFromReservation: jest.fn(() => "TestOwner"),
    SetReservationStateAndInbox: jest.fn(),
    GetUserReservationsPodUrl: jest.fn(
      () => "https://testpodurl.com/reservations/"
    ),
  };
});
jest.mock("../outgoingCommunications");
jest.mock("../../../common/hooks/useReservations");
jest.mock("../../../common/components/snackbar");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("actionOnNewReservationState", () => {
  test("DoOnStateChange for Cancelled", async () => {
    DoOnStateChange(
      "TestReservationId",
      ReservationState.CANCELLED,
      "TestGuestInboxUrl"
    );

    expect(SetReservationStateAndInbox).toBeCalledWith(
      "TestReservationId",
      ReservationState.CANCELLED,
      "TestGuestInboxUrl"
    );
    expect(ConfirmReservationStateRequest).toBeCalledWith(
      ReservationState.CANCELLED,
      "TestGuestInboxUrl",
      "https://testpodurl.com/reservations/TestReservationId/inbox"
    );
  });

  test("DoOnStateChange for Active", async () => {
    let mockCreateCustomSnackbar = (): JSX.Element => <></>;

    (ShowCustomSnackbar as jest.Mock).mockImplementation((creator) => {
      mockCreateCustomSnackbar = creator;
    });

    DoOnStateChange(
      "TestReservationId",
      ReservationState.ACTIVE,
      "TestGuestInboxUrl"
    );

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    const checkinSnackbarProps = mockCreateCustomSnackbar().props;
    expect(checkinSnackbarProps).toEqual({
      reservationId: "TestReservationId",
      guestWebId: "TestOwner",
      replyInbox: "TestGuestInboxUrl",
    });

    expect(SetReservationStateAndInbox).toBeCalledWith(
      "TestReservationId",
      ReservationState.ACTIVE,
      "TestGuestInboxUrl"
    );
    expect(ConfirmReservationStateRequest).toBeCalledWith(
      ReservationState.ACTIVE,
      "TestGuestInboxUrl",
      "https://testpodurl.com/reservations/TestReservationId/inbox"
    );
  });

  test("DoOnStateChange for Past", async () => {
    let mockCreateCustomSnackbar = (): JSX.Element => <></>;

    (ShowCustomSnackbar as jest.Mock).mockImplementation((creator) => {
      mockCreateCustomSnackbar = creator;
    });

    DoOnStateChange(
      "TestReservationId",
      ReservationState.PAST,
      "TestGuestInboxUrl"
    );

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    const checkoutSnackbarProps = mockCreateCustomSnackbar().props;
    expect(checkoutSnackbarProps).toEqual({
      reservationId: "TestReservationId",
      reservationOwner: "TestOwner",
      replyInbox: "TestGuestInboxUrl",
    });

    expect(SetReservationStateAndInbox).toBeCalledWith(
      "TestReservationId",
      ReservationState.PAST,
      "TestGuestInboxUrl"
    );
    expect(ConfirmReservationStateRequest).toBeCalledWith(
      ReservationState.PAST,
      "TestGuestInboxUrl",
      "https://testpodurl.com/reservations/TestReservationId/inbox"
    );
  });
});
