import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RequiredFields } from "../fields-subpage";
import { BookingPage } from "../../../pages/booking";
import { MockSession } from "../../../../common/util/__tests__/testUtil";
import { personFieldToRdfMap } from "../../../../common/vocabularies/rdf_person";
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
    useRequiredFields: jest.fn(),
  };
});

function Render(
  setCurrentPage: () => void,
  confirmReservation: () => () => void
): RenderResult {
  return render(
    <RequiredFields
      currentPage={BookingPage.RequiredFields}
      setCurrentPage={setCurrentPage}
      confirmReservation={confirmReservation}
    />
  );
}

describe("<RequiredFields />", () => {
  test("Renders correctly and calls components with correct arguments", async () => {
    (useRequiredFields as jest.Mock).mockReturnValue({
      data: requiredFields,
      isLoading: false,
      isError: false,
    });
    const setCurrentPage = jest.fn();
    const confirmReservation = jest.fn();

    const requiredFieldsSubpage = Render(setCurrentPage, confirmReservation);
    expect(requiredFieldsSubpage).toBeDefined();

    expect(confirmButtonProps.rdfFields).toEqual(requiredFields);
    expect(confirmButtonProps.webId).toEqual("TestWebId");

    confirmButtonProps.onClickFunction();

    expect(setCurrentPage).toBeCalledWith(BookingPage.Finish);
    expect(confirmReservation).toBeCalled();
  });
});
