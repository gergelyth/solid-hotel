import React, { Dispatch, SetStateAction } from "react";
import { act, render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { EditFieldPopup } from "../edit-field-popup";
import { Field } from "../../../types/Field";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";

const testField: Field = {
  fieldShortName: "nationality",
  fieldPrettyName: "Nationality",
  fieldValue: undefined,
  rdfName: personFieldToRdfMap.nationality,
  datatype: xmlSchemaTypes.country,
};

let setFieldValue: Dispatch<SetStateAction<string | undefined>>;
jest.mock("../input-type-elements", () => {
  return {
    FieldInputElementBasedOnType: (props: {
      field: Field;
      currentFieldValue: string | undefined;
      setFieldValue: Dispatch<SetStateAction<string | undefined>>;
    }) => {
      setFieldValue = props.setFieldValue;
      return null;
    },
  };
});

function Render(
  onConfirmation: () => void,
  isPopupShowing: boolean,
  setPopupVisibility: () => void
): RenderResult {
  return render(
    <EditFieldPopup
      field={testField}
      onConfirmation={onConfirmation}
      isPopupShowing={isPopupShowing}
      setPopupVisibility={setPopupVisibility}
    />
  );
}

describe("<EditFieldPopup />", () => {
  test("With dialog disabled doesn't render edit button", async () => {
    const editFieldPopup = Render(
      () => undefined,
      false,
      () => undefined
    );
    expect(editFieldPopup).toBeDefined();
    const editFieldButton = editFieldPopup.queryByTestId(
      "edit-field-popup-button"
    );
    expect(editFieldButton).toBeNull();
  });

  test("With dialog enabled button click calls editField method and hides dialog", async () => {
    const newFieldValue = "NewNationality";

    const setPopupVisibility = jest.fn();
    const onConfirmation = jest.fn();
    const editFieldPopup = Render(onConfirmation, true, setPopupVisibility);

    const editFieldButton = editFieldPopup.queryByTestId(
      "edit-field-popup-button"
    ) as Element;
    expect(editFieldButton).toBeDefined();
    expect(editFieldButton).toBeDisabled();

    act(() => {
      setFieldValue(newFieldValue);
    });
    expect(editFieldButton).toBeEnabled();

    await userEvent.click(editFieldButton);
    expect(onConfirmation).toBeCalledWith(
      testField.fieldShortName,
      newFieldValue
    );
    expect(setPopupVisibility).toBeCalledWith(false);
  });
});
