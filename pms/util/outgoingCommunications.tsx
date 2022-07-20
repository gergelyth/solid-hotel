import { getPropertyAll } from "@inrupt/solid-client";
import { SerializeFailureReport } from "../../common/notifications/failureReport";
import { SerializeReservationStateChange } from "../../common/notifications/reservationStateChange";
import { SerializePairingRequestWithInformation } from "../../common/notifications/pairingRequestWithInformation";
import { SerializeGuestPrivacyNotification } from "../../common/notifications/privacyNotification";
import { ReservationState } from "../../common/types/ReservationState";
import { GetHotelProfileThing } from "../../common/util/hotelProfileHandler";
import {
  GetOwnerAndAnonymizeInMemory,
  SaveInboxAndReturnReservation,
  SetInboxToHotelInboxInMemory,
} from "./pairingRequestUtil";
import {
  CreateActiveProfilePrivacyToken,
  CreateInboxPrivacyToken,
} from "./privacyHelper";
import {
  ParseReservation,
  RevalidateReservations,
} from "../../common/hooks/useReservations";
import { SerializeProfileModification } from "../../common/notifications/profileModification";
import { ProfileUpdate } from "../../common/util/tracker/trackerSendChange";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { HotelPrivacyToken } from "../../common/types/HotelPrivacyToken";
import { SerializePrivacyInformationDeletion } from "../../common/notifications/privacyInformationDeletion";
import { GetStartOfNextDay } from "../../common/util/helpers";
import { RevalidateHotelPrivacyTokens } from "../../common/hooks/usePrivacyTokens";
import { SafeSaveDatasetInContainer } from "../../common/util/solidWrapper";

/**
 * Creates the reservation state change notification dataset and submits it into the guest reservation inbox.
 */
export async function ConfirmReservationStateRequest(
  newState: ReservationState,
  guestInboxUrl: string | null,
  hotelInboxUrl: string
): Promise<void> {
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL null");
  }

  const notificationDataset = SerializeReservationStateChange(
    hotelInboxUrl,
    newState
  );

  await SafeSaveDatasetInContainer(guestInboxUrl, notificationDataset);
  RevalidateReservations();
}

/**
 * Creates the failure report notification dataset and submits it into the guest reservation inbox.
 */
export async function ReportFailureToGuest(
  errorMessage: string,
  resultState: ReservationState,
  guestInboxUrl: string | null
): Promise<void> {
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL null");
  }

  const notificationDataset = SerializeFailureReport(errorMessage, resultState);

  await SafeSaveDatasetInContainer(guestInboxUrl, notificationDataset);
}

/**
 * Creates the pairing request notification dataset with the reservation information and the personal information fields initialized during offline check-in.
 * Adjust some fields to represent a normal reservation (now that it's paired with a guest Pod as usual) and creates the required privacy tokens as well.
 */
export async function SendPairingRequestWithInformation(
  reservationUrl: string,
  hotelInboxUrl: string,
  guestInboxUrl: string
): Promise<void> {
  const reservationThing = await SaveInboxAndReturnReservation(
    reservationUrl,
    guestInboxUrl
  );

  const { anonymizedReservationThing, hotelProfileOwnerUrl } =
    GetOwnerAndAnonymizeInMemory(reservationThing);
  const finalReservationThing = SetInboxToHotelInboxInMemory(
    anonymizedReservationThing,
    hotelInboxUrl
  );

  const hotelProfileThing = await GetHotelProfileThing(hotelProfileOwnerUrl);

  const notificationDataset = SerializePairingRequestWithInformation(
    finalReservationThing,
    hotelProfileThing
  );

  await SafeSaveDatasetInContainer(guestInboxUrl, notificationDataset);

  const parsedReservation = ParseReservation(
    finalReservationThing,
    reservationUrl
  );

  const inboxPrivacyToken = await CreateInboxPrivacyToken(
    reservationUrl,
    guestInboxUrl,
    parsedReservation
  );
  SendPrivacyToken(guestInboxUrl, inboxPrivacyToken);

  const profilePrivacyTokenDataset = await CreateActiveProfilePrivacyToken(
    hotelProfileOwnerUrl,
    guestInboxUrl,
    reservationUrl,
    getPropertyAll(hotelProfileThing),
    GetStartOfNextDay(parsedReservation.dateTo)
  );
  SendPrivacyToken(guestInboxUrl, profilePrivacyTokenDataset);
  RevalidateHotelPrivacyTokens();
}

/**
 * Creates the privacy token notification dataset and submits it into the guest reservation inbox.
 */
export async function SendPrivacyToken(
  guestInboxUrl: string,
  privacyToken: GuestPrivacyToken
): Promise<void> {
  const notificationDataset = SerializeGuestPrivacyNotification(privacyToken);

  await SafeSaveDatasetInContainer(guestInboxUrl, notificationDataset);
}

/**
 * Creates the privacy token deletion notice notification dataset and submits it into the guest reservation inbox.
 */
export async function SendPrivacyTokenDeletionNotice(
  privacyToken: HotelPrivacyToken,
  guestInboxUrl?: string
): Promise<void> {
  if (!privacyToken.urlAtHotel) {
    throw new Error(
      "Token URL was annulled outside of the application. Cannot delete"
    );
  }
  const guestInbox = guestInboxUrl ?? privacyToken.guestInbox;
  if (!guestInbox) {
    throw new Error(
      "Guest inbox is undefined in privacy token or in supplied argument. That can only happen for data protection tokens. This is called by mistake."
    );
  }

  const notificationDataset = SerializePrivacyInformationDeletion(
    privacyToken.urlAtHotel
  );

  await SafeSaveDatasetInContainer(guestInbox, notificationDataset);
}

/**
 * Creates the profile modification notification dataset and submits it into the guest reservation inbox.
 */
export async function SendProfileModification(
  approvedFields: ProfileUpdate,
  guestInboxUrl: string
): Promise<void> {
  const profileModification = SerializeProfileModification(approvedFields);

  await SafeSaveDatasetInContainer(guestInboxUrl, profileModification);
}
