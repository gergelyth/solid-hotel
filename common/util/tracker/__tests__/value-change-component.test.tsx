import React from "react";
import { screen, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ValueChangeComponent } from "../value-change-component";
import { IncomingProfileChangeStrings } from "../profile-change-strings";
import { FieldValueChange } from "../util";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";

function Render(
  fieldValueChange: FieldValueChange,
  optionValue: boolean,
  setOptionValue: (rdfName: string, newValue: boolean) => void,
  requiresApproval: boolean
): RenderResult {
  return render(
    <ValueChangeComponent
      fieldValueChange={fieldValueChange}
      optionValue={optionValue}
      setOptionValue={setOptionValue}
      requiresApproval={requiresApproval}
      profileChangeStrings={IncomingProfileChangeStrings()}
    />
  );
}

describe("<ValueChangeComponent />", () => {
  test("Renders correctly with requiring approval", async () => {
    const fieldValueChange = {
      name: "First name",
      rdfName: personFieldToRdfMap["firstName"],
      oldValue: "John",
      newValue: "Sam",
    };
    const mockSetOptionValue = jest.fn();
    const valueChangeComponent = Render(
      fieldValueChange,
      true,
      mockSetOptionValue,
      true
    );
    expect(valueChangeComponent).toBeDefined();

    expect(
      valueChangeComponent.queryByTestId("value-change-radio")
    ).toBeInTheDocument();
    // valueChangeComponent.debug();

    await userEvent.click(screen.getByDisplayValue("false"));

    expect(mockSetOptionValue).toBeCalledWith(
      personFieldToRdfMap["firstName"],
      false
    );

    await userEvent.click(screen.getByDisplayValue("true"));

    expect(mockSetOptionValue).toBeCalledWith(
      personFieldToRdfMap["firstName"],
      true
    );
  });

  test("Renders correctly without requiring approval - radio is disabled", async () => {
    const fieldValueChange = {
      name: "First name",
      rdfName: personFieldToRdfMap["firstName"],
      oldValue: "John",
      newValue: "Sam",
    };
    const mockSetOptionValue = jest.fn();
    const valueChangeComponent = Render(
      fieldValueChange,
      true,
      mockSetOptionValue,
      false
    );
    expect(valueChangeComponent).toBeDefined();

    const falseOption = screen.getByDisplayValue("false");
    expect(falseOption).toBeInTheDocument();
    expect(falseOption).toBeDisabled();

    const trueOption = screen.getByDisplayValue("true");
    expect(trueOption).toBeInTheDocument();
    expect(trueOption).toBeDisabled();
  });
});
