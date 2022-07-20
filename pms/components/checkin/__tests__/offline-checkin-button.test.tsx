import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OfflineCheckinButton } from "../offline-checkin-button";
import { TestReservations } from "../../../../common/util/__tests__/testUtil";
import { Field } from "../../../../common/types/Field";
import { mocked } from "ts-jest/utils";
import { NextRouter } from "next/router";
import { countryToRdfMap } from "../../../../common/vocabularies/rdf_countries";

const routerPush = jest.fn();
function MockRouter(): NextRouter {
  const mockRouter = mocked({
    push: routerPush,
  } as unknown as NextRouter);
  return mockRouter;
}

jest.mock("next/router", () => {
  return {
    useRouter: jest.fn(() => MockRouter()),
  };
});

let editFieldProps: {
  field: Field;
  onConfirmation: (fieldName: string, newValue: string) => void;
  isPopupShowing: boolean;
  setPopupVisibility: () => void;
};
jest.mock("../../../../common/components/profile/edit-field-popup", () => {
  return {
    EditFieldPopup: jest.fn((props) => {
      editFieldProps = props;
      return null;
    }),
  };
});

jest.mock("../../../../common/util/solid_wrapper", () => {
  return {
    SafeSaveDatasetInContainer: jest.fn(() => {
      return Promise.resolve({
        internal_resourceInfo: {
          sourceIri: "https://testpodurl.com/profiles/11111111",
          isRawData: true,
        },
      });
    }),
  };
});

function Render(): RenderResult {
  return render(<OfflineCheckinButton reservation={TestReservations[0]} />);
}

describe("<OfflineCheckinButton />", () => {
  test("Renders correctly and redirects to correct page", async () => {
    const offlineCheckinButtonComponent = Render();
    expect(offlineCheckinButtonComponent).toBeDefined();

    await editFieldProps.onConfirmation("nationality", countryToRdfMap.ESP);

    expect(routerPush).toBeCalledWith({
      pathname: "/checkin",
      query: {
        id: "reservationId1",
        nationality: countryToRdfMap.ESP,
        hotelProfile: "https://testpodurl.com/profiles/11111111#hotelProfile",
      },
    });
  });
});
