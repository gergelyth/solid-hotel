import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShowCustomSnackbar } from "../../../../common/components/snackbar";
import { HotelToRdf } from "../tracked-rdf-field-collector";
import { UserTrackerInitializerSnackbar } from "../tracker-initializer";
import { MockSession } from "../../../../common/util/__tests__/testUtil";
import { CacheProfile } from "../../../../common/util/tracker/profileCache";
import { Subscribe } from "../../../../common/util/tracker/tracker";

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
jest.mock("../../../../common/util/tracker/tracker");
jest.mock("../../../../common/util/tracker/profileCache");
jest.mock("../../../../common/util/solid", () => {
  return {
    GetSession: jest.fn(() => MockSession(true, TestWebId)),
  };
});

function Render(): RenderResult {
  return render(
    <UserTrackerInitializerSnackbar snackbarId={"TestSnackbarId"} />
  );
}

describe("<UserTrackerInitializerSnackbar  />", () => {
  test("Initialization caches profiles and subscribes to changes correctly", async () => {
    let mockCreateCustomSnackbar = (): JSX.Element => <></>;

    (ShowCustomSnackbar as jest.Mock).mockImplementation((creator) => {
      mockCreateCustomSnackbar = creator;
    });

    const trackerInitializerSnackbar = Render();
    expect(trackerInitializerSnackbar).toBeDefined();

    const trackedRdfCollectorProps = mockCreateCustomSnackbar().props;

    const mockHotelToRdf: HotelToRdf = {};
    mockHotelToRdf["HotelWebId1"] = new Set<string>([
      "test:testProperty1",
      "test:testProperty2",
    ]);
    mockHotelToRdf["HotelWebId2"] = new Set<string>(["test:testProperty1"]);

    act(() => {
      trackedRdfCollectorProps.setHotelToRdfMap(mockHotelToRdf);
    });

    const flushPromises = (): Promise<void> => new Promise(setImmediate);
    await act(async () => {
      await flushPromises();
    });

    expect(CacheProfile).toBeCalledWith(TestWebId, [
      "test:testProperty1",
      "test:testProperty2",
    ]);
    expect(Subscribe).toBeCalledWith(TestWebId, expect.anything());
  });
});
