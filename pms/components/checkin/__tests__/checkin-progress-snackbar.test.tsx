import React from "react";
import { render, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useHotelPrivacyTokens } from "../../../../common/hooks/usePrivacyTokens";
import {
  TestGuestFields,
  TestGuestPrivacyTokens,
  TestHotelPrivacyTokens,
  TestReservations,
} from "../../../../common/util/__tests__/testUtil";
import {
  CreateActiveProfilePrivacyToken,
  FindWebIdTokenAndDeleteIt,
} from "../../../util/privacyHelper";
import { CheckinProgressSnackbar } from "../checkin-progress-snackbar";
import { useGuest } from "../../../../common/hooks/useGuest";
import { useRequiredFields } from "../../../../common/hooks/useMockApi";
import { SetReservationOwnerToHotelProfile } from "../../../../common/util/solidReservations";
import { CreateReservationDataset } from "../../../../common/util/datasetFactory";
import { Thing } from "@inrupt/solid-client";
import { CacheProfileFields } from "../../../../common/util/tracker/profile-cache";
import { SubscribeToProfileChanges } from "../../../util/trackerInitializer";
import { personFieldToRdfMap } from "../../../../common/vocabularies/rdf_person";
import { GetThing } from "../../../../common/util/solid";

const TestReservationId = "TestReservationId";
const GuestWebId = "GuestWebId";
const ReplyInbox = "https://testpodurl.com/inbox/";

jest.mock("../../../../common/components/custom-progress-snackbar", () => {
  return {
    CustomProgressSnackbar: () => null,
  };
});

jest.mock("../../../../common/util/solidReservations", () => {
  return {
    SetReservationOwnerToHotelProfile: jest.fn(),
    GetUserReservationsPodUrl: jest.fn(
      () => "https://testpodurl.com/reservations/"
    ),
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
jest.mock("../../../../common/hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});

jest.mock("../../../../common/util/solidWrapper", () => {
  return {
    SafeSaveDatasetInContainer: jest.fn(() => {
      return {
        internal_resourceInfo: {
          sourceIri: "https://testpodurl.com/hotelprofiles/11111111",
          isRawData: true,
        },
      };
    }),
  };
});

jest.mock("../../../../common/consts/solidIdentifiers", () => {
  return {
    ...jest.requireActual("../../../../common/consts/solidIdentifiers"),
    PrivacyTokensUrl: "https://testpodurl.com/privacy/",
    HotelProfilesUrl: "https://testpodurl.com/hotelprofiles/",
  };
});

jest.mock("../../../util/privacyHelper");
jest.mock("../../../util/outgoingCommunications");
jest.mock("../../../../common/components/snackbar");

jest.mock("../../../util/trackerInitializer");
jest.mock("../../../../common/util/tracker/profile-cache");

jest.mock("../../../../common/hooks/usePrivacyTokens", () => {
  return {
    useHotelPrivacyTokens: jest.fn(),
    RevalidateHotelPrivacyTokens: jest.fn(),
  };
});

function CreateReservationThing(): Thing | null {
  const dataset = CreateReservationDataset(TestReservations[0]);
  const thing = GetThing(dataset, "reservation");
  return thing;
}

function Render(): RenderResult {
  return render(
    <CheckinProgressSnackbar
      snackbarKey={"TestKey"}
      reservationId={TestReservationId}
      guestWebId={GuestWebId}
      replyInbox={ReplyInbox}
    />
  );
}

describe("<CheckinProgressSnackbar >", () => {
  test("Check-in execute expected operations with expected arguments", async () => {
    (useRequiredFields as jest.Mock).mockReturnValue({
      data: requiredFields,
      isLoading: false,
      isError: false,
    });
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
    (SetReservationOwnerToHotelProfile as jest.Mock).mockReturnValue(
      CreateReservationThing()
    );
    (CreateActiveProfilePrivacyToken as jest.Mock).mockReturnValue(
      TestGuestPrivacyTokens[1]
    );

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

    const expectedWebId =
      "https://testpodurl.com/hotelprofiles/11111111#hotelProfile";

    expect(CacheProfileFields).toBeCalledWith(expectedWebId, guestFields);
    expect(SubscribeToProfileChanges).toBeCalledWith(
      expectedWebId,
      requiredFields
    );
    expect(SetReservationOwnerToHotelProfile).toBeCalledWith(
      TestReservationId,
      expectedWebId
    );
    expect(FindWebIdTokenAndDeleteIt).toBeCalledWith(
      TestHotelPrivacyTokens,
      TestReservationId,
      false
    );
    expect(CreateActiveProfilePrivacyToken).toBeCalledWith(
      expectedWebId,
      ReplyInbox,
      `https://testpodurl.com/reservations/${TestReservationId}/reservation`,
      requiredFields,
      new Date("2021-07-08")
    );
  });
});
