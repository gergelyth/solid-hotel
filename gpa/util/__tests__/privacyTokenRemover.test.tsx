import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TestGuestPrivacyTokens } from "../../../common/util/__tests__/testUtil";
import { PrivacyTokenRemover } from "../privacyTokenRemover";
import { useGuestPrivacyTokens } from "../../../common/hooks/usePrivacyTokens";
import { SafeDeleteDataset } from "../../../common/util/solidWrapper";
import { ShowWarningSnackbar } from "../../../common/components/snackbar";

jest.mock("../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});
jest.mock("../../../common/components/snackbar");

jest.mock("../../../common/hooks/usePrivacyTokens", () => {
  return {
    useGuestPrivacyTokens: jest.fn(),
    RevalidateGuestPrivacyTokens: jest.fn(),
  };
});
jest.mock("../../../common/util/solid", () => {
  return {
    GetUserPrivacyPodUrl: () => "TestGuestPrivacyContainer",
  };
});
jest.mock("../../../common/util/solidWrapper");

function Render(hotelUrl: string): RenderResult {
  return render(
    <PrivacyTokenRemover snackbarId={"TestSnackbarId"} hotelUrl={hotelUrl} />
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("<PrivacyTokenRemover />", () => {
  test("Calls to remove correct privacy token", async () => {
    (useGuestPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: TestGuestPrivacyTokens,
        isLoading: false,
        isError: false,
      };
    });

    const privacyTokenRemoverSnackbar = Render(
      TestGuestPrivacyTokens[1].urlAtHotel ?? ""
    );
    expect(privacyTokenRemoverSnackbar).toBeDefined();

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    expect(SafeDeleteDataset).toBeCalledWith(
      TestGuestPrivacyTokens[1].urlAtGuest
    );
  });

  test("Warns user if there's nothing to remove but exits gracefully", async () => {
    (useGuestPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: TestGuestPrivacyTokens,
        isLoading: false,
        isError: false,
      };
    });

    const privacyTokenRemoverSnackbar = Render("NotExistingHotelUrl");
    expect(privacyTokenRemoverSnackbar).toBeDefined();

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    expect(SafeDeleteDataset).not.toBeCalledWith();
    expect(ShowWarningSnackbar).toBeCalled();
  });
});
