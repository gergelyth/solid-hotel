import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorComponent } from "../error-component";

function Render(): RenderResult {
  return render(<ErrorComponent />);
}

describe("<ErrorComponent />", () => {
  test("Renders correctly without issue", async () => {
    const errorComponent = Render();
    expect(errorComponent).toBeDefined();
  });
});
