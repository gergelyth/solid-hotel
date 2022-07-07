import { mockSolidDatasetFrom, SolidDataset } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { ShowErrorSnackbar } from "../../components/snackbar";
import {
  GetCurrentDatePushedBy,
  GetDayAfterDate,
  GetStartOfNextDay,
  GetToday,
  GetTomorrow,
  GlobSolidUrlPaths,
  NotEmptyItem,
  OnHookErrorFunction,
  ShowError,
} from "../helpers";
import { GetDataSet } from "../solid";
import { MockContainer } from "./testUtil";

jest.mock("../../util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});
jest.mock("../../components/snackbar", () => {
  return {
    ShowErrorSnackbar: jest.fn(),
  };
});

const datasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/reservations/": MockContainer(
    "https://testpodurl.com/reservations/",
    ["reservationId1/", "reservationId2/"]
  ),
  "https://testpodurl.com/reservations/reservationId1/": MockContainer(
    "https://testpodurl.com/reservations/reservationId1/",
    ["inbox", "reservation"]
  ),
  "https://testpodurl.com/reservations/reservationId2/": MockContainer(
    "https://testpodurl.com/reservations/reservationId2/",
    ["inbox", "reservation"]
  ),
  "https://testpodurl.com/reservations/reservationId1/inbox/": MockContainer(
    "https://testpodurl.com/reservations/reservationId1/inbox/",
    ["recursiveContainer1"]
  ),
  "https://testpodurl.com/reservations/reservationId2/inbox/": MockContainer(
    "https://testpodurl.com/reservations/reservationId2/inbox/",
    ["recursiveContainer2", "recursiveContainer3"]
  ),
  "https://testpodurl.com/reservations/reservationId1/inbox/recursiveContainer1/":
    MockContainer(
      "https://testpodurl.com/reservations/reservationId1/inbox/recursiveContainer1/",
      ["testResource1"]
    ),
  "https://testpodurl.com/reservations/reservationId2/inbox/recursiveContainer2/":
    MockContainer(
      "https://testpodurl.com/reservations/reservationId1/inbox/recursiveContainer2/",
      ["testResource2"]
    ),
  "https://testpodurl.com/reservations/reservationId2/inbox/recursiveContainer3/":
    MockContainer(
      "https://testpodurl.com/reservations/reservationId1/inbox/recursiveContainer3/",
      ["testResource3"]
    ),
};

function MockGetDataSet(
  datasetMap: { [url: string]: SolidDataset },
  url: string
): Promise<SolidDataset> {
  const dataset = datasetMap[url];
  if (dataset) {
    return Promise.resolve(dataset);
  } else {
    return Promise.resolve(mockSolidDatasetFrom(url));
  }
}

describe("helpers", () => {
  test("NotEmptyItem filters out null and undefined elements", () => {
    const testArray = [
      undefined,
      "one",
      "two",
      null,
      undefined,
      "undefined",
      "three",
      "null",
    ];

    const result = testArray.filter(NotEmptyItem);
    expect(result).toEqual(["one", "two", "undefined", "three", "null"]);
  });

  test("GlobSolidUrlPaths returns correct paths", async () => {
    (GetDataSet as jest.Mock).mockImplementation((url) =>
      MockGetDataSet(datasetMap, url)
    );
    const result = await GlobSolidUrlPaths(
      "https://testpodurl.com/reservations/*inbox",
      {}
    );
    expect(result).toEqual([
      "https://testpodurl.com/reservations/reservationId1/inbox",
      "https://testpodurl.com/reservations/reservationId2/inbox",
    ]);
  });

  test("GlobSolidUrlPaths with multiple wildcards returns correct paths", async () => {
    (GetDataSet as jest.Mock).mockImplementation((url) =>
      MockGetDataSet(datasetMap, url)
    );
    const result = await GlobSolidUrlPaths(
      "https://testpodurl.com/reservations/*inbox/*/testResource",
      {}
    );
    expect(result).toEqual([
      "https://testpodurl.com/reservations/reservationId1/inbox/recursiveContainer1/testResource",
      "https://testpodurl.com/reservations/reservationId2/inbox/recursiveContainer2/testResource",
      "https://testpodurl.com/reservations/reservationId2/inbox/recursiveContainer3/testResource",
    ]);
  });

  test("GetCurrentDatePushedBy returns the correct date", () => {
    const mockDate = new Date("2021-08-22");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    const result = GetCurrentDatePushedBy(1, 2, 7);
    expect(result).toEqual(new Date("2022-19-29"));

    jestDateSpy.mockRestore();
  });

  test("GetToday returns the correct date", () => {
    const mockDate = new Date("2021-08-22 15:22:15");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    const result = GetToday();
    expect(result).toEqual(mockDate);

    jestDateSpy.mockRestore();
  });

  test("GetTomorrow returns the start of tomorrow", () => {
    const mockDate = new Date("2021-08-22 15:22:15");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    const result = GetTomorrow();
    expect(result).toEqual(new Date("2021-08-23 00:00:00"));

    jestDateSpy.mockRestore();
  });

  test("GetDayAfterDate returns the correct date", () => {
    const result = GetDayAfterDate(new Date("2021-08-22 15:22:15"));
    expect(result).toEqual(new Date("2021-08-23 15:22:15"));
  });

  test("GetStartOfNextDay returns the correct date", () => {
    const result = GetStartOfNextDay(new Date("2021-08-22 15:22:15"));
    expect(result).toEqual(new Date("2021-08-23 00:00:00"));
  });

  test("OnHookErrorFunction shows error snackbar if the user is not logged in", () => {
    const mockShowErrorSnackbar = jest.fn();
    (ShowErrorSnackbar as jest.Mock).mockImplementation(() =>
      mockShowErrorSnackbar()
    );
    const error: Error = {
      name: "TestError",
      message: "Not signed in",
    };
    OnHookErrorFunction(error, "TestSwrKey");
    expect(mockShowErrorSnackbar).toBeCalled();
  });

  test("OnHookErrorFunction shows error snackbar and console errors for error", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const mockShowErrorSnackbar = jest.fn();
    (ShowErrorSnackbar as jest.Mock).mockImplementation(() =>
      mockShowErrorSnackbar()
    );
    const error: Error = {
      name: "TestError",
      message: "Some random error",
    };
    OnHookErrorFunction(error, "TestSwrKey");
    expect(mockShowErrorSnackbar).toBeCalled();

    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      1,
      "Error using hook for key [TestSwrKey]"
    );
    expect(consoleErrorMock).toHaveBeenNthCalledWith(2, {
      name: "TestError",
      message: "Some random error",
    });

    consoleErrorMock.mockRestore();
  });

  test("ShowError shows error snackbar and console error unrecoverable error", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const mockShowErrorSnackbar = jest.fn();
    (ShowErrorSnackbar as jest.Mock).mockImplementation(() =>
      mockShowErrorSnackbar()
    );
    ShowError("TestMessage", false);
    expect(mockShowErrorSnackbar).toBeCalled();

    expect(consoleErrorMock).toBeCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(
      1,
      "TestMessage - unexpected behaviour might occur."
    );

    consoleErrorMock.mockRestore();
  });

  test("ShowError shows error snackbar and console error recoverable error", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const mockShowErrorSnackbar = jest.fn();
    (ShowErrorSnackbar as jest.Mock).mockImplementation(() =>
      mockShowErrorSnackbar()
    );
    ShowError("TestMessage", true);
    expect(mockShowErrorSnackbar).toBeCalled();

    expect(consoleErrorMock).toBeCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenNthCalledWith(1, "TestMessage");

    consoleErrorMock.mockRestore();
  });
});
