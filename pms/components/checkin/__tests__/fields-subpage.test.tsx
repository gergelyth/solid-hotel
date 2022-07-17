import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextRouter } from "next/router";
import { mocked } from "ts-jest/utils";
import { RequiredFieldsAtOfflineCheckin } from "../fields-subpage";
import { OfflineCheckinPage } from "../../../pages/checkin";
import { useRequiredFields } from "../../../../common/hooks/useMockApi";

function MockRouter(): NextRouter {
  const mockRouter = mocked({
    query: {
      id: "reservationId1",
      nationality: "English",
      hotelProfile: "https://testpodurl.com/hotelprofiles/id1",
    },
  } as unknown as NextRouter);
  return mockRouter;
}

let requiredFieldsProps: {
  data: string[];
  hotelProfileWebId: string;
  currentPage: OfflineCheckinPage;
  setCurrentPage: () => void;
  executeCheckin: (hotelProfileWebId: string) => void;
};
jest.mock("../required-fields", () => {
  return {
    RequiredFields: jest.fn((props) => {
      requiredFieldsProps = props;
      return null;
    }),
  };
});

jest.mock("next/router", () => {
  return {
    useRouter: jest.fn(() => MockRouter()),
  };
});

const requiredFields = ["foaf:firstName", "foaf:lastName"];
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

function Render(): RenderResult {
  return render(
    <RequiredFieldsAtOfflineCheckin
      currentPage={OfflineCheckinPage.RequiredFields}
      setCurrentPage={() => undefined}
      executeCheckin={() => undefined}
    />
  );
}

describe("<RequiredFieldsAtOfflineCheckin />", () => {
  test("Parses query parameters correctly", async () => {
    const requiredFieldsComponent = Render();
    expect(requiredFieldsComponent).toBeDefined();

    expect(useRequiredFields).toBeCalledWith("English");

    expect(requiredFieldsProps.data).toEqual(requiredFields);
    expect(requiredFieldsProps.hotelProfileWebId).toEqual(
      "https://testpodurl.com/hotelprofiles/id1"
    );
    expect(requiredFieldsProps.currentPage).toEqual(
      OfflineCheckinPage.RequiredFields
    );
  });
});