import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OfflineCheckinPage } from "../../../pages/checkin";
import { QrComponent } from "../qr-subpage";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../common/util/pairingTokenHandler", () => {
  return {
    GetPairingToken: jest.fn(() => "testPairingToken"),
  };
});

function Render(setCurrentPage: () => void): RenderResult {
  const result = render(
    <QrComponent
      reservationId={"TestReservationId"}
      currentPage={OfflineCheckinPage.QrComponent}
      setCurrentPage={setCurrentPage}
    />
  );
  return result;
}

describe("<QrComponent />", () => {
  test("Renders correctly and produces the correct URL", async () => {
    const setCurrentPage = jest.fn();
    const qrComponent = Render(setCurrentPage);
    expect(qrComponent).toBeDefined();

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    const link = qrComponent.container.querySelector("a");
    expect(link?.href).toEqual(
      "http://localhost:3000/pairing?hotelInboxUrl=nullTestReservationId%252Finbox&token=testPairingToken"
    );

    const continueButton = qrComponent.queryByTestId(
      "continue-button"
    ) as Element;
    expect(continueButton).toBeInTheDocument();

    await userEvent.click(continueButton);

    expect(setCurrentPage).toBeCalledWith(OfflineCheckinPage.Finish);
  });
});
