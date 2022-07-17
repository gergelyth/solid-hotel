import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestGuestFields } from "../../../../common/util/__tests__/testUtil";
import { RegistrationCard } from "../registration-card";
import userEvent from "@testing-library/user-event";
import { useReactToPrint } from "react-to-print";

jest.mock("../../../../common/components/profile/profile-main", () => {
  return {
    ProfileMain: jest.fn(() => null),
  };
});

jest.mock("react-to-print", () => {
  return {
    useReactToPrint: jest.fn(),
  };
});

function Render(): RenderResult {
  const requiredFields = TestGuestFields.map((field) => field.rdfName);
  return render(
    <RegistrationCard
      rdfFields={requiredFields}
      webId={"TestWebId"}
      isPopupShowing={true}
      setPopupVisibility={() => undefined}
    />
  );
}

describe("<RegistrationCard  />", () => {
  test("Renders correctly and button calls the print method", async () => {
    const printFunction = jest.fn();
    (useReactToPrint as jest.Mock).mockReturnValue(printFunction);

    const registrationCard = Render();
    expect(registrationCard).toBeDefined();

    const printButton = registrationCard.queryByTestId(
      "print-button"
    ) as Element;

    await userEvent.click(printButton);

    expect(printFunction).toBeCalled();
  });
});
