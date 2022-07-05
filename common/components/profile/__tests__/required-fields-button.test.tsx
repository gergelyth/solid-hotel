import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { useGuest } from "../../../hooks/useGuest";
import { ConfirmRequiredFieldsButton } from "../required-fields-button";
import userEvent from "@testing-library/user-event";

const testGuestFields: Field[] = [
  {
    fieldShortName: "firstName",
    fieldPrettyName: "First name",
    fieldValue: "",
    rdfName: "schema:firstName",
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "lastName",
    fieldPrettyName: "Last name",
    fieldValue: "Smith",
    rdfName: "schema:lastName",
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: "English",
    rdfName: "schema:nationality",
    datatype: xmlSchemaTypes.string,
  },
];

jest.mock("../../../hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
    RevalidateGuest: jest.fn(),
  };
});

function Render(onClickFunction: () => void): RenderResult {
  const rdfFields = testGuestFields.map((field) => field.rdfName);
  return render(
    <ConfirmRequiredFieldsButton
      onClickFunction={onClickFunction}
      rdfFields={rdfFields}
      webId={"TestWebId"}
      onMount={() => undefined}
    />
  );
}

describe("<ConfirmRequiredFieldsButton />", () => {
  test("Renders correctly with confirm button disabled if at least one field value is empty", async () => {
    (useGuest as jest.Mock).mockImplementation(() => {
      return {
        guestFields: testGuestFields,
        isLoading: false,
        isError: false,
      };
    });
    const requiredFieldsButtonComponent = Render(() => undefined);
    expect(requiredFieldsButtonComponent).toBeDefined();

    const button = requiredFieldsButtonComponent.queryByTestId(
      "required-fields-button"
    );
    expect(button).toBeDefined();
    expect(button).toBeDisabled();
  });

  test("Confirm button is enabled when missing field value is filled in and calls confirm action", async () => {
    testGuestFields[0].fieldValue = "John";

    (useGuest as jest.Mock).mockImplementation(() => {
      return {
        guestFields: testGuestFields,
        isLoading: false,
        isError: false,
      };
    });
    const mockConfirmAction = jest.fn();
    const requiredFieldsButtonComponent = Render(mockConfirmAction);
    expect(requiredFieldsButtonComponent).toBeDefined();

    const button = requiredFieldsButtonComponent.queryByTestId(
      "required-fields-button"
    ) as Element;
    expect(button).toBeDefined();
    expect(button).toBeEnabled();

    await userEvent.click(button);

    expect(mockConfirmAction).toBeCalled();
  });
});
