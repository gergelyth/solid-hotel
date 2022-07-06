import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../footer";

function Render(): RenderResult {
  return render(<Footer />);
}

describe("<Footer />", () => {
  test("Renders correctly without issue", async () => {
    const footer = Render();
    expect(footer).toBeDefined();
  });
});
