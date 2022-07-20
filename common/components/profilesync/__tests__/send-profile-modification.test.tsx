import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProfileUpdate } from "../tracker-send-change";
import { SendProfileModificationSnackbar } from "../send-profile-modification";
import { ReservationState } from "../../../types/ReservationState";
import { PersonFieldToRdfMap } from "../../../vocabularies/rdfPerson";
import { TestReservations } from "../../../util/__tests__/testUtil";
import { useReservations } from "../../../hooks/useReservations";
import { ShowWarningSnackbar } from "../../snackbar";
import { ReservationAtHotel } from "../../../types/ReservationAtHotel";
import { CountryToRdfMap } from "../../../vocabularies/rdfCountries";

const TestReservationUrl = "TestReservationsUrl";

jest.mock("../../../hooks/useReservations");
jest.mock("../../../components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});
jest.mock("../../../components/snackbar");

function Render(
  fieldOptions: ProfileUpdate,
  reservationFilter: (reservation: ReservationAtHotel) => boolean,
  sendModification: (
    approvedFields: ProfileUpdate,
    inboxUrl: string
  ) => Promise<void>
): RenderResult {
  return render(
    <SendProfileModificationSnackbar
      snackbarId={"TestSnackbarId"}
      fieldOptions={fieldOptions}
      reservationsUrl={TestReservationUrl}
      reservationFilter={reservationFilter}
      sendModification={sendModification}
    />
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  (useReservations as jest.Mock).mockReturnValue({
    items: TestReservations,
    isLoading: false,
    isError: false,
  });
});

describe("<SendProfileModificationSnackbar  />", () => {
  test("Snackbar correctly filters field updates and sends them to the appropriate inbox", async () => {
    const profileUpdate: ProfileUpdate = {};
    profileUpdate[PersonFieldToRdfMap["firstName"]] = {
      status: false,
      newValue: "Sam",
    };
    profileUpdate[PersonFieldToRdfMap["nationality"]] = {
      status: true,
      newValue: CountryToRdfMap.ESP,
    };

    const mockSendModiciation = jest.fn();
    const sendProfileModSnackbar = Render(
      profileUpdate,
      (reservation) => reservation.state === ReservationState.ACTIVE,
      mockSendModiciation
    );
    expect(sendProfileModSnackbar).toBeDefined();

    //Wait for async useEffect() to finish
    expect(
      await sendProfileModSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    const expectedProfileUpdate: ProfileUpdate = {};
    expectedProfileUpdate[PersonFieldToRdfMap["nationality"]] = {
      status: true,
      newValue: CountryToRdfMap.ESP,
    };
    expect(mockSendModiciation).toBeCalledWith(
      expectedProfileUpdate,
      "CounterpartyInboxUrl2"
    );

    expect(ShowWarningSnackbar).not.toBeCalled();
  });

  test("Snackbar with no matching reservations doesn't call send method", async () => {
    const profileUpdate: ProfileUpdate = {};
    profileUpdate[PersonFieldToRdfMap["firstName"]] = {
      status: false,
      newValue: "Sam",
    };
    profileUpdate[PersonFieldToRdfMap["nationality"]] = {
      status: true,
      newValue: CountryToRdfMap.ESP,
    };

    const mockSendModiciation = jest.fn();
    const sendProfileModSnackbar = Render(
      profileUpdate,
      (reservation) => reservation.state === ReservationState.PAST,
      mockSendModiciation
    );
    expect(sendProfileModSnackbar).toBeDefined();

    //Wait for async useEffect() to finish
    expect(
      await sendProfileModSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    expect(ShowWarningSnackbar).toBeCalledWith(
      "No reservations found matching filter"
    );
    expect(mockSendModiciation).not.toBeCalled();
  });

  test("Snackbar with no approved fields doesn't call send method", async () => {
    const profileUpdate: ProfileUpdate = {};
    profileUpdate[PersonFieldToRdfMap["firstName"]] = {
      status: false,
      newValue: "Sam",
    };
    profileUpdate[PersonFieldToRdfMap["nationality"]] = {
      status: false,
      newValue: CountryToRdfMap.ESP,
    };

    const mockSendModiciation = jest.fn();
    const sendProfileModSnackbar = Render(
      profileUpdate,
      (reservation) => reservation.state === ReservationState.ACTIVE,
      mockSendModiciation
    );
    expect(sendProfileModSnackbar).toBeDefined();

    //Wait for async useEffect() to finish
    expect(
      await sendProfileModSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    expect(ShowWarningSnackbar).toBeCalledWith(
      "There are no approved fields to send. Sending nothing."
    );
    expect(mockSendModiciation).not.toBeCalled();
  });
});
