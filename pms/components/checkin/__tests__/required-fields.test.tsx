import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OfflineCheckinPage } from "../../../pages/checkin";
import { RequiredFields } from "../required-fields";
import { PersonFieldToRdfMap } from "../../../../common/vocabularies/rdfPerson";

let confirmButtonProps: {
  onClickFunction: () => void;
  rdfFields: string[] | undefined;
  webId: string;
  onMount: () => void;
};
jest.mock(
  "../../../../common/components/profile/required-fields-button",
  () => {
    return {
      ConfirmRequiredFieldsButton: jest.fn((props) => {
        confirmButtonProps = props;
        return null;
      }),
    };
  }
);

let profileMainProps: {
  rdfFields: string[] | undefined;
  webId?: string;
  editable?: boolean;
  deletable?: boolean;
  centerJustify?: boolean;
  forceRender?: () => void;
};
jest.mock("../../../../common/components/profile/profile-main", () => {
  return {
    ProfileMain: jest.fn((props) => {
      profileMainProps = props;
      return null;
    }),
  };
});

const requiredFields = [
  PersonFieldToRdfMap.firstName,
  PersonFieldToRdfMap.lastName,
];
function Render(
  setCurrentPage: () => void,
  executeCheckin: () => void
): RenderResult {
  return render(
    <RequiredFields
      data={requiredFields}
      hotelProfileWebId={"https://testpodurl.com/hotelprofiles/id1"}
      currentPage={OfflineCheckinPage.RequiredFields}
      setCurrentPage={setCurrentPage}
      executeCheckin={executeCheckin}
    />
  );
}

describe("<RequiredFieldsAtOfflineCheckin />", () => {
  test("Parses query parameters correctly", async () => {
    const setCurrentPage = jest.fn();
    const executeCheckin = jest.fn();

    const requiredFieldsComponent = Render(setCurrentPage, executeCheckin);
    expect(requiredFieldsComponent).toBeDefined();

    await confirmButtonProps.onClickFunction();
    expect(setCurrentPage).toBeCalledWith(OfflineCheckinPage.QrComponent);
    expect(executeCheckin).toBeCalled;

    expect(confirmButtonProps.rdfFields).toEqual(requiredFields);

    expect(profileMainProps.rdfFields).toEqual(requiredFields);
    expect(profileMainProps.deletable).toBeFalsy();
  });
});
