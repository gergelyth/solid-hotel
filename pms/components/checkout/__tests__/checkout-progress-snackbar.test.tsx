import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useHotelPrivacyTokens } from "../../../../common/hooks/usePrivacyTokens";
import {
  TestGuestFields,
  TestGuestPrivacyTokens,
  TestHotelPrivacyTokens,
} from "../../../../common/util/__tests__/testUtil";
import {
  CreateDataProtectionProfilePrivacyToken,
  FindHotelProfileTokenAndDeleteIt,
  FindInboxTokenAndDeleteIt,
} from "../../../util/privacyHelper";
import { useGuest } from "../../../../common/hooks/useGuest";
import { useDataProtectionInformation } from "../../../../common/hooks/useMockApi";
import { SetReservationOwnerToHotelProfile } from "../../../../common/util/solid_reservations";
import { DeleteFromCache } from "../../../../common/util/tracker/profile-cache";
import { CheckoutProgressSnackbar } from "../checkout-progress-snackbar";
import { ReservationState } from "../../../../common/types/ReservationState";
import { UnSubscribe } from "../../../../common/util/tracker/tracker";
import { SafeDeleteDataset } from "../../../../common/util/solid_wrapper";
import { SendPrivacyToken } from "../../../util/outgoingCommunications";

const TestReservationId = "TestReservationId";
const ReplyInbox = "https://testpodurl.com/inbox/";
const ReservationOwner =
  "https://testpodurl.com/hotelprofiles/11111111#hotelProfile";

jest.mock("../../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../../common/util/solid_reservations", () => {
  return {
    SetReservationOwnerToHotelProfile: jest.fn(),
    GetUserReservationsPodUrl: jest.fn(
      () => "https://testpodurl.com/reservations/"
    ),
  };
});

const dataProtectionFields = ["foaf:firstName", "foaf:lastName"];
jest.mock("../../../../common/hooks/useMockApi", () => {
  return {
    useDataProtectionInformation: jest.fn(() => {
      return {
        data: {
          dataProtectionYears: 5,
          dataProtectionFields: dataProtectionFields,
        },
        isLoading: false,
        isError: false,
      };
    }),
  };
});
jest.mock("../../../util/privacyHelper");
jest.mock("../../../util/outgoingCommunications");
jest.mock("../../../../common/components/snackbar");

jest.mock("../../../../common/hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});

jest.mock("../../../../common/util/tracker/profile-cache");
jest.mock("../../../../common/util/tracker/tracker");

jest.mock("../../../../common/hooks/usePrivacyTokens", () => {
  return {
    useHotelPrivacyTokens: jest.fn(),
    RevalidateHotelPrivacyTokens: jest.fn(),
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    ...jest.requireActual("../../../../common/consts/solidIdentifiers"),
    PrivacyTokensUrl: "https://testpodurl.com/privacy/",
    DataProtectionProfilesUrl: "https://testpodurl.com/dataprotectionprofiles/",
  };
});

jest.mock("../../../../common/util/solid_wrapper", () => {
  return {
    SafeSaveDatasetInContainer: jest.fn(() => {
      return {
        internal_resourceInfo: {
          sourceIri: "https://testpodurl.com/dataprotectionprofiles/22222222",
          isRawData: true,
        },
      };
    }),
    SafeDeleteDataset: jest.fn(),
  };
});

function Render(): RenderResult {
  return render(
    <CheckoutProgressSnackbar
      key={"TestKey"}
      reservationId={TestReservationId}
      reservationOwner={ReservationOwner}
      replyInbox={ReplyInbox}
    />
  );
}

describe("<CheckoutProgressSnackbar >", () => {
  test("Check-out executes expected operations with expected arguments", async () => {
    (useHotelPrivacyTokens as jest.Mock).mockImplementation(() => {
      return {
        items: TestHotelPrivacyTokens,
        isLoading: false,
        isError: false,
      };
    });
    const guestFields = [TestGuestFields[0], TestGuestFields[1]];
    (useGuest as jest.Mock).mockImplementation(() => {
      return {
        guestFields: guestFields,
        isLoading: false,
        isError: false,
      };
    });

    const mockCheckoutDate = new Date("2021-07-22 15:22:15");
    const jestDateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockCheckoutDate as unknown as string);

    const expectedPrivacyToken = {
      ...TestGuestPrivacyTokens[1],
      forReservationState: ReservationState.PAST,
    };
    (CreateDataProtectionProfilePrivacyToken as jest.Mock).mockReturnValue(
      expectedPrivacyToken
    );

    const checkoutProgressSnackbar = Render();
    expect(checkoutProgressSnackbar).toBeDefined();

    // Wait for async useEffect() to finish
    expect(
      await checkoutProgressSnackbar.findByText(
        (content, element) => element?.tagName.toLowerCase() === "div"
      )
    ).toBeInTheDocument();

    jestDateSpy.mockRestore();

    expect(useDataProtectionInformation).toBeCalledWith(
      undefined,
      ReservationOwner
    );
    expect(useGuest).toBeCalledWith(dataProtectionFields, ReservationOwner);
    expect(useHotelPrivacyTokens).toBeCalledWith(
      "https://testpodurl.com/privacy/"
    );

    const expectedWebId =
      "https://testpodurl.com/dataprotectionprofiles/22222222#hotelProfile";

    expect(SetReservationOwnerToHotelProfile).toBeCalledWith(
      TestReservationId,
      expectedWebId
    );
    expect(UnSubscribe).toBeCalledWith(ReservationOwner);
    expect(DeleteFromCache).toBeCalledWith(ReservationOwner);
    expect(SafeDeleteDataset).toBeCalledWith(
      "https://testpodurl.com/hotelprofiles/11111111"
    );

    expect(FindHotelProfileTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId
    );
    expect(CreateDataProtectionProfilePrivacyToken).toBeCalledWith(
      expectedWebId,
      `https://testpodurl.com/reservations/${TestReservationId}/reservation`,
      dataProtectionFields,
      new Date("2026-07-23")
    );

    expect(SendPrivacyToken).toBeCalledWith(ReplyInbox, expectedPrivacyToken);
    expect(FindInboxTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId,
      true
    );
  });
});