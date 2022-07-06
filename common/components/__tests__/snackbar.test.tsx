import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  CloseSnackbar,
  GlobalSnackbar,
  ShowCustomSnackbar,
  ShowErrorSnackbar,
  ShowSuccessSnackbar,
  ShowWarningSnackbar,
} from "../snackbar";
import { useSnackbar } from "notistack";

jest.mock("notistack", () => {
  return {
    __esModule: true,
    useSnackbar: jest.fn(),
  };
});

function Render(): RenderResult {
  return render(<GlobalSnackbar />);
}

let enqueueSnackbar = jest.fn();
let closeSnackbar = jest.fn();
beforeEach(() => {
  enqueueSnackbar = jest.fn();
  closeSnackbar = jest.fn();

  (useSnackbar as jest.Mock).mockImplementation(() => {
    return {
      enqueueSnackbar: enqueueSnackbar,
      closeSnackbar: closeSnackbar,
    };
  });
});

describe("<GlobalSnackbar />", () => {
  test("Basic snackbars of different variants work as expected", async () => {
    const snackbar = Render();
    expect(snackbar).not.toBeUndefined();

    const commonProps = {
      key: undefined,
      persist: false,
      preventDuplicate: false,
    };

    ShowSuccessSnackbar("Success snackbar");
    expect(enqueueSnackbar).toBeCalledWith("Success snackbar", {
      variant: "success",
      ...commonProps,
    });

    ShowWarningSnackbar("Warning snackbar");
    expect(enqueueSnackbar).toBeCalledWith("Warning snackbar", {
      variant: "warning",
      ...commonProps,
    });

    ShowErrorSnackbar("Error snackbar");
    expect(enqueueSnackbar).toBeCalledWith("Error snackbar", {
      variant: "error",
      ...commonProps,
    });

    CloseSnackbar("TestKey");
    expect(closeSnackbar).toBeCalledWith("TestKey");
  });

  test("Custom snackbar works as expected", async () => {
    const snackbar = Render();
    expect(snackbar).not.toBeUndefined();

    ShowCustomSnackbar(() => <>TestContent</>);
    expect(enqueueSnackbar).toBeCalled();
  });
});
