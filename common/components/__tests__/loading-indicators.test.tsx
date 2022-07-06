import React from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AddLoadingIndicator,
  LoadingIndicators,
  RemoveLoadingIndicator,
} from "../loading-indicators";

function AssertIndicatorCount(component: RenderResult, count: number): void {
  expect(component.queryAllByRole("progressbar").length).toEqual(count);
}

function Render(): RenderResult {
  return render(<LoadingIndicators />);
}

describe("<LoadingIndicators />", () => {
  test("Renders correct number of loading indicators", async () => {
    const loadingIndicatorsComponent = Render();
    expect(loadingIndicatorsComponent).toBeDefined();

    act(() => {
      AddLoadingIndicator("swrKey1");
      AddLoadingIndicator("swrKey2");
    });

    AssertIndicatorCount(loadingIndicatorsComponent, 2);

    act(() => {
      RemoveLoadingIndicator("swrKey1");
    });
    AssertIndicatorCount(loadingIndicatorsComponent, 1);

    act(() => {
      RemoveLoadingIndicator("swrKey2");
    });
    AssertIndicatorCount(loadingIndicatorsComponent, 0);
  });

  test("Handles existing addition and bad removal correctly", async () => {
    const loadingIndicatorsComponent = Render();
    expect(loadingIndicatorsComponent).toBeDefined();

    act(() => {
      AddLoadingIndicator("swrKey1");
    });
    AssertIndicatorCount(loadingIndicatorsComponent, 1);
    act(() => {
      AddLoadingIndicator("swrKey1");
    });
    AssertIndicatorCount(loadingIndicatorsComponent, 1);

    act(() => {
      RemoveLoadingIndicator("swrKey2");
    });
    AssertIndicatorCount(loadingIndicatorsComponent, 1);
  });
});
