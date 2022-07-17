import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useHotelPrivacyTokens } from "../../../../common/hooks/usePrivacyTokens";
import {
  TestGuestFields,
  TestHotelPrivacyTokens,
} from "../../../../common/util/__tests__/testUtil";
import {
  FindInboxTokenAndDeleteIt,
  FindWebIdTokenAndDeleteIt,
} from "../../../util/privacyHelper";
import { CheckinProgressSnackbar } from "../checkin-progress-snackbar";
import { useGuest } from "../../../../common/hooks/useGuest";
import { useRequiredFields } from "../../../../common/hooks/useMockApi";

const TestReservationId = "TestReservationId";
const GuestWebId = "GuestWebId";
const ReplyInbox = "https://testpodurl.com/inbox/";

jest.mock("../../../util/privacyHelper");
jest.mock("../../../../common/util/tracker/profile-cache");
jest.mock("../../../../common/components/snackbar");
jest.mock("../../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../../common/util/solid_wrapper", () => {
  return {
    SafeSaveDatasetInContainer: jest.fn(() => {
      return {
        internal_resourceInfo: {
          sourceIri: "https://testpodurl.com/profiles/11111111",
          isRawData: true,
        },
      };
    }),
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    PrivacyTokensUrl: "https://testpodurl.com/privacy/",
    HotelProfilesUrl: "https://testpodurl.com/hotelprofiles/",
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
jest.mock("../../../../common/hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});
jest.mock("../../../../common/hooks/usePrivacyTokens", () => {
  return {
    useHotelPrivacyTokens: jest.fn(),
    RevalidateHotelPrivacyTokens: jest.fn(),
  };
});

function Render(): RenderResult {
  return render(
    <CheckinProgressSnackbar
      key={"TestKey"}
      reservationId={TestReservationId}
      guestWebId={GuestWebId}
      replyInbox={ReplyInbox}
    />
  );
}

describe("<CheckinProgressSnackbar >", () => {
  test("Check-in execute expected operations with expected arguments", async () => {
    (useHotelPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: TestHotelPrivacyTokens,
        isLoading: false,
        isError: false,
      };
    });
    (useGuest as jest.Mock).mockImplementation(() => {
      return {
        guestFields: [TestGuestFields[0], TestGuestFields[1]],
        isLoading: false,
        isError: false,
      };
    });

    const checkinProgressSnackbar = Render();
    expect(checkinProgressSnackbar).toBeDefined();

    // Wait for async useEffect() to finish
    expect(
      await checkinProgressSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    expect(useRequiredFields).toBeCalledWith(undefined, GuestWebId);
    expect(useGuest).toBeCalledWith(requiredFields, GuestWebId);
    expect(useHotelPrivacyTokens).toBeCalledWith(
      "https://testpodurl.com/privacy/"
    );
  });
});
