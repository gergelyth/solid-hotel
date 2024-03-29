import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RequiredFieldsAtCheckin } from "../fields-subpage";
import { MockSession } from "../../../../common/util/__tests__/testUtil";
import { CheckinPage } from "../../../pages/reservations/[id]";
import { CacheProfile } from "../../../../common/util/tracker/profileCache";
import userEvent from "@testing-library/user-event";
import { PersonFieldToRdfMap } from "../../../../common/vocabularies/rdfPerson";
import { useRequiredFields } from "../../../../common/hooks/useMockApi";

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
jest.mock("../../../../common/components/reservations/hotel-details");
jest.mock("../../../../common/components/reservations/room-details");
jest.mock("../../../../common/util/tracker/profileCache");

jest.mock("../../../../common/components/profile/profile-main", () => {
  return {
    ProfileMain: jest.fn(() => null),
  };
});

jest.mock("../../../../common/util/solid", () => {
  return {
    GetSession: jest.fn(() => MockSession(true, "TestWebId")),
  };
});

const requiredFields = [
  PersonFieldToRdfMap.firstName,
  PersonFieldToRdfMap.lastName,
];
jest.mock("../../../../common/hooks/useMockApi", () => {
  return {
    useRequiredFields: jest.fn(),
  };
});

function Render(
  setCurrentPage: () => void,
  executeCheckin: () => () => void
): RenderResult {
  return render(
    <RequiredFieldsAtCheckin
      currentPage={CheckinPage.RequiredFields}
      setCurrentPage={setCurrentPage}
      executeCheckin={executeCheckin}
    />
  );
}

describe("<RequiredFieldsAtCheckin />", () => {
  test("Renders correctly and calls components with correct arguments", async () => {
    (useRequiredFields as jest.Mock).mockReturnValue({
      data: requiredFields,
      isLoading: false,
      isError: false,
    });
    const setCurrentPage = jest.fn();
    const executeCheckin = jest.fn();

    const requiredFieldsSubpage = Render(setCurrentPage, executeCheckin);
    expect(requiredFieldsSubpage).toBeDefined();

    expect(confirmButtonProps.rdfFields).toEqual(requiredFields);
    expect(confirmButtonProps.webId).toEqual("TestWebId");

    await confirmButtonProps.onClickFunction();

    expect(CacheProfile).toBeCalledWith("TestWebId", requiredFields);

    expect(setCurrentPage).toBeCalledWith(CheckinPage.Finish);
    expect(executeCheckin).toBeCalled();

    expect(
      requiredFieldsSubpage.queryByTestId("toc-dialog")
    ).not.toBeInTheDocument();

    const tocLink = requiredFieldsSubpage.queryByTestId("toc-link") as Element;
    expect(tocLink).toBeDefined();

    await userEvent.click(tocLink);

    expect(
      requiredFieldsSubpage.queryByTestId("toc-dialog")
    ).toBeInTheDocument();
  });
});
