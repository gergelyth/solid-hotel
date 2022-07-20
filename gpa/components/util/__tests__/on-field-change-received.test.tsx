import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FieldChangeReceiverSnackbar } from "../on-field-change-received";
import { ShowCustomSnackbar } from "../../../../common/components/snackbar";
import { HotelToRdf } from "../tracked-rdf-field-collector";

const TestWebId = "TestWebId";

jest.mock("../tracked-rdf-field-collector", () => {
  return {
    TrackedRdfFieldCollector: jest.fn(),
  };
});

jest.mock("../../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});
jest.mock("../../../../common/components/snackbar");
jest.mock("../../../../common/util/solidReservations", () => {
  return {
    GetUserReservationsPodUrl: () => "TestReservationContainer",
  };
});

function Render(): RenderResult {
  return render(
    <FieldChangeReceiverSnackbar
      snackbarId={"TestSnackbarId"}
      url={TestWebId}
    />
  );
}

describe("<FieldChangeReceiverSnackbar />", () => {
  test("Operation sets up field change reaction correctly", async () => {
    let mockCreateCustomSnackbar = (): JSX.Element => <></>;

    (ShowCustomSnackbar as jest.Mock).mockImplementation((creator) => {
      mockCreateCustomSnackbar = creator;
    });
    const fieldChangeSnackbar = Render();
    expect(fieldChangeSnackbar).toBeDefined();

    const trackedRdfCollectorProps = mockCreateCustomSnackbar().props;

    const mockHotelToRdf: HotelToRdf = {};
    mockHotelToRdf["HotelWebId"] = new Set<string>(["test:testProperty"]);

    act(() => {
      trackedRdfCollectorProps.setHotelToRdfMap(mockHotelToRdf);
    });

    const sendChangeSnackbarProps = mockCreateCustomSnackbar().props;

    expect(sendChangeSnackbarProps.profileUrl).toEqual(TestWebId);
    expect(sendChangeSnackbarProps.rdfFields).toEqual(["test:testProperty"]);
    expect(sendChangeSnackbarProps.requiresApproval).toBeTruthy();
  });
});
