import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProfileUpdate } from "../../profilesync/tracker-send-change";
import { UpdateLocalProfileSnackbar } from "../update-local-profile";
import { PersonFieldToRdfMap } from "../../../vocabularies/rdfPerson";

const TestProfileUrl = "TestProfileUrl";

jest.mock("../../../hooks/useGuest");
jest.mock("../../custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});
let mockShowWarningSnackbar = jest.fn();
jest.mock("../../snackbar", () => {
  return {
    ShowWarningSnackbar: () => mockShowWarningSnackbar(),
  };
});
let mockSetMultipleFieldsInProfile = jest.fn();
jest.mock("../../../util/solidProfile", () => {
  return {
    SetMultipleFieldsInProfile: (
      profileUrl: string,
      newFields: {
        [rdfName: string]: string;
      }
    ) => mockSetMultipleFieldsInProfile(profileUrl, newFields),
  };
});
let mockUpdateProfileInMemory = jest.fn();
jest.mock("../../../util/tracker/profileCache", () => {
  return {
    UpdateProfileInMemory: (profileUrl: string, fieldOptions: ProfileUpdate) =>
      mockUpdateProfileInMemory(profileUrl, fieldOptions),
  };
});
let mockIgnoreNextUpdate = jest.fn();
jest.mock("../../../util/tracker/tracker", () => {
  return {
    IgnoreNextUpdate: (profileUrl: string) => mockIgnoreNextUpdate(profileUrl),
  };
});

function Render(fieldOptions: ProfileUpdate): RenderResult {
  return render(
    <UpdateLocalProfileSnackbar
      snackbarKey={"TestKey"}
      profileUrl={TestProfileUrl}
      fieldOptions={fieldOptions}
    />
  );
}

beforeEach(() => {
  //Re-initialize mock methods in order to be able to test "no-call" in one test after a test where it was called
  mockSetMultipleFieldsInProfile = jest.fn();
  mockShowWarningSnackbar = jest.fn();
  mockUpdateProfileInMemory = jest.fn();
  mockIgnoreNextUpdate = jest.fn();
});

describe("<UpdateLocalProfileSnackbar />", () => {
  test("Snackbar doesn't call update methods if there are no approved fields", async () => {
    const fieldOptions: ProfileUpdate = {};
    fieldOptions[PersonFieldToRdfMap.firstName] = {
      status: false,
      newValue: "John",
    };
    fieldOptions[PersonFieldToRdfMap.lastName] = {
      status: false,
      newValue: "Smith",
    };
    const updateProfileSnackbar = Render(fieldOptions);
    expect(updateProfileSnackbar).toBeDefined();

    expect(mockShowWarningSnackbar).toBeCalled();

    expect(mockIgnoreNextUpdate).not.toBeCalled();
    expect(mockSetMultipleFieldsInProfile).not.toBeCalled();
    expect(mockUpdateProfileInMemory).not.toBeCalled();
  });

  test("With at least one approved field there is no warning and appropriate methods are called", async () => {
    const fieldOptions: ProfileUpdate = {};
    fieldOptions[PersonFieldToRdfMap.firstName] = {
      status: true,
      newValue: "John",
    };
    fieldOptions[PersonFieldToRdfMap.lastName] = {
      status: false,
      newValue: "Smith",
    };
    const updateProfileSnackbar = Render(fieldOptions);
    expect(updateProfileSnackbar).toBeDefined();

    //Wait for async useEffect() to finish
    expect(
      await updateProfileSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    expect(mockShowWarningSnackbar).not.toBeCalled();

    expect(mockIgnoreNextUpdate).toBeCalledWith(TestProfileUrl);
    const expectedArgument: {
      [rdfName: string]: string;
    } = {};
    expectedArgument[PersonFieldToRdfMap.firstName] = "John";
    expect(mockSetMultipleFieldsInProfile).toBeCalledWith(
      TestProfileUrl,
      expectedArgument
    );
    expect(mockUpdateProfileInMemory).toBeCalledWith(
      TestProfileUrl,
      fieldOptions
    );
  });
});
