import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RequiredFieldsAtCheckin } from "../fields-subpage";
import { MockSession } from "../../../../common/util/__tests__/testUtil";
import { CheckinPage } from "../../../pages/reservations/[id]";
import { CacheProfile } from "../../../../common/util/tracker/profile-cache";
import userEvent from "@testing-library/user-event";
import { personFieldToRdfMap } from "../../../../common/vocabularies/rdf_person";

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
jest.mock("../../../../common/util/tracker/profile-cache");

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
  personFieldToRdfMap.firstName,
  personFieldToRdfMap.lastName,
];
jest.mock("../../../../common/hooks/useMockApi", () => {
  return {
    useRequiredFields: jest.fn(() => {
      return {
        data: requiredFields,
        isLoading: false,
        isError: false,
      };
    }),
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
