import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CancelProgressSnackbar } from "../cancel-progress-snackbar";
import { useHotelPrivacyTokens } from "../../../../common/hooks/usePrivacyTokens";
import { TestHotelPrivacyTokens } from "../../../../common/util/__tests__/testUtil";
import {
  FindEmailTokenAndDeleteIt,
  FindInboxTokenAndDeleteIt,
  FindWebIdTokenAndDeleteIt,
} from "../../../util/privacyHelper";

const TestReservationId = "TestReservationId";

jest.mock("../../../util/privacyHelper");
jest.mock("../../../../common/components/snackbar");
jest.mock("../../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    PrivacyTokensUrl: "https://testpodurl.com/privacy/",
  };
});

jest.mock("../../../../common/hooks/usePrivacyTokens", () => {
  return {
    useHotelPrivacyTokens: jest.fn(),
    RevalidateHotelPrivacyTokens: jest.fn(),
  };
});

function Render(): RenderResult {
  return render(
    <CancelProgressSnackbar
      snackbarKey={"TestKey"}
      reservationId={TestReservationId}
    />
  );
}

describe("<CancelProgressSnackbar  />", () => {
  test("Deletes correct privacy tokens", async () => {
    (useHotelPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: TestHotelPrivacyTokens,
        isLoading: false,
        isError: false,
      };
    });

    const cancelProgressSnackbar = Render();
    expect(cancelProgressSnackbar).toBeDefined();

    // Wait for async useEffect() to finish
    expect(
      await cancelProgressSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    expect(useHotelPrivacyTokens).toBeCalledWith(
      "https://testpodurl.com/privacy/"
    );
    expect(FindWebIdTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId,
      true
    );
    expect(FindEmailTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId
    );
    expect(FindInboxTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId,
      true
    );
  });
});
