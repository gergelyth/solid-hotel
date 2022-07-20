import React, { Dispatch, SetStateAction } from "react";
import { act, render, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Field } from "../../../types/Field";
import { ProfileField } from "../profile-field";
import { xmlSchemaTypes } from "../../../consts/supportedTypes";
import { RemoveField, SetField } from "../../../util/solidProfile";
import { personFieldToRdfMap } from "../../../vocabularies/rdf_person";
import { countryToRdfMap } from "../../../vocabularies/rdf_countries";

jest.mock("../../../util/solidProfile", () => {
  return {
    RemoveField: jest.fn(),
    SetField: jest.fn(),
  };
});

jest.mock("../../../hooks/useGuest", () => {
  return {
    RevalidateGuest: () => jest.fn(),
    TriggerRefetchGuest: () => jest.fn(),
  };
});

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

const testGuestFields: Field[] = [
  {
    fieldShortName: "firstName",
    fieldPrettyName: "First name",
    fieldValue: "John",
    rdfName: personFieldToRdfMap.firstName,
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "lastName",
    fieldPrettyName: "Last name",
    fieldValue: "Smith",
    rdfName: personFieldToRdfMap.lastName,
    datatype: xmlSchemaTypes.string,
  },
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: countryToRdfMap.GBR,
    rdfName: personFieldToRdfMap.nationality,
    datatype: xmlSchemaTypes.country,
  },
];

function Render(editable: boolean, deletable: boolean): RenderResult {
  const field = testGuestFields[0];
  const rdfFields = testGuestFields.map((field) => field.rdfName);
  return render(
    <ProfileField
      key={field.fieldShortName}
      field={field}
      guestFields={testGuestFields}
      rdfFields={rdfFields}
      editable={editable}
      deletable={deletable}
      centerJustify={true}
      forceRender={() => undefined}
    />
  );
}

describe("<ProfileField />", () => {
  test("Editable but non-deletable field renders correctly with edit button displayed and delete button hidden", async () => {
    const profileFieldComponent = Render(true, false);
    expect(profileFieldComponent).toBeDefined();

    const editFieldButton =
      profileFieldComponent.queryByTestId("edit-field-button");
    expect(editFieldButton).toBeDefined();

    const deleteFieldButton = profileFieldComponent.queryByTestId(
      "delete-field-button"
    );
    expect(deleteFieldButton).toBeNull();
  });

  test("Editable but deletable field renders correctly with edit and delete button displayed", async () => {
    const profileFieldComponent = Render(true, false);
    expect(profileFieldComponent).toBeDefined();

    const editFieldButton =
      profileFieldComponent.queryByTestId("edit-field-button");
    expect(editFieldButton).toBeDefined();

    const deleteFieldButton = profileFieldComponent.queryByTestId(
      "delete-field-button"
    );
    expect(deleteFieldButton).toBeDefined();
  });

  test("Edit field functionality triggers field change events correctly", async () => {
    const newFieldValue = "NewFirstName";

    const mockSetField = jest.fn();
    (SetField as jest.Mock).mockImplementation((rdfName, newValue) =>
      mockSetField(rdfName, newValue)
    );

    const profileFieldComponent = Render(true, false);
    expect(profileFieldComponent).toBeDefined();

    const editFieldButton = profileFieldComponent.queryByTestId(
      "edit-field-button"
    ) as Element;
    expect(editFieldButton).toBeDefined();

    await userEvent.click(editFieldButton);

    act(() => {
      setFieldValue(newFieldValue);
    });
    expect(editFieldButton).toBeEnabled();

    const editFieldPopupButton = profileFieldComponent.queryByTestId(
      "edit-field-popup-button"
    ) as Element;
    await userEvent.click(editFieldPopupButton);

    expect(mockSetField).toBeCalledWith(
      personFieldToRdfMap.firstName,
      newFieldValue
    );
  });

  test("Delete field functionality triggers field delete events correctly", async () => {
    const mockRemoveField = jest.fn();
    (RemoveField as jest.Mock).mockImplementation((rdfName) =>
      mockRemoveField(rdfName)
    );

    const profileFieldComponent = Render(true, true);
    expect(profileFieldComponent).toBeDefined();

    const deleteFieldButton = profileFieldComponent.queryByTestId(
      "delete-field-button"
    ) as Element;
    expect(deleteFieldButton).toBeDefined();

    await userEvent.click(deleteFieldButton);

    const deleteFieldPopupButton = profileFieldComponent.queryByTestId(
      "delete-field-popup-button"
    ) as Element;
    await userEvent.click(deleteFieldPopupButton);

    expect(mockRemoveField).toBeCalledWith(personFieldToRdfMap.firstName);
  });
});
