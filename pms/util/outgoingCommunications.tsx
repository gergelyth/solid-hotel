import {
  getPropertyAll,
  saveSolidDatasetInContainer,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SerializeFailureReport } from "../../common/notifications/FailureReport";
import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { SerializePairingRequestWithInformation } from "../../common/notifications/PairingRequestWithInformation";
import { SerializeGuestPrivacyNotification } from "../../common/notifications/PrivacyNotification";
import { ReservationState } from "../../common/types/ReservationState";
import { GetSession } from "../../common/util/solid";
import { GetHotelProfileThing } from "../../common/util/hotelProfileHandler";
import {
  GetOwnerAndAnonymizeInMemory,
  SaveInboxAndReturnReservation,
  SetInboxToHotelInboxInMemory,
} from "./pairingRequestUtil";
import {
  CreateActiveProfilePrivacyToken,
  CreateReservationPrivacyToken,
} from "./privacyHelper";
import { ParseReservation } from "../../common/hooks/useReservations";
import { SerializeProfileModification } from "../../common/notifications/ProfileModification";
import { ProfileUpdate } from "../../common/util/tracker/trackerSendChange";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";

export async function ConfirmReservationStateRequest(
  newState: ReservationState,
  guestInboxUrl: string | null,
  hotelInboxUrl: string,
  session: Session = GetSession()
): Promise<void> {
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL null");
  }

  const notificationDataset = SerializeReservationStateChange(
    hotelInboxUrl,
    newState
  );

  await saveSolidDatasetInContainer(guestInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

export async function ReportFailureToGuest(
  errorMessage: string,
  resultState: ReservationState,
  guestInboxUrl: string | null,
  session: Session = GetSession()
): Promise<void> {
  if (!guestInboxUrl) {
    throw new Error("Guest inbox URL null");
  }

  const notificationDataset = SerializeFailureReport(errorMessage, resultState);

  await saveSolidDatasetInContainer(guestInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

export async function SendPairingRequestWithInformation(
  reservationUrl: string,
  hotelInboxUrl: string,
  guestInboxUrl: string,
  session: Session = GetSession()
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

  await saveSolidDatasetInContainer(guestInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });

  const parsedReservation = ParseReservation(
    finalReservationThing,
    reservationUrl
  );
  const reservationPrivacyTokenDataset = await CreateReservationPrivacyToken(
    reservationUrl,
    guestInboxUrl,
    parsedReservation
  );
  SendPrivacyToken(guestInboxUrl, reservationPrivacyTokenDataset);

  const profilePrivacyTokenDataset = await CreateActiveProfilePrivacyToken(
    hotelProfileOwnerUrl,
    guestInboxUrl,
    reservationUrl,
    getPropertyAll(hotelProfileThing),
    parsedReservation.dateTo
  );
  SendPrivacyToken(guestInboxUrl, profilePrivacyTokenDataset);
}

export async function SendPrivacyToken(
  guestInboxUrl: string,
  privacyToken: GuestPrivacyToken,
  session: Session = GetSession()
): Promise<void> {
  const notificationDataset = SerializeGuestPrivacyNotification(privacyToken);

  await saveSolidDatasetInContainer(guestInboxUrl, notificationDataset, {
    fetch: session.fetch,
  });
}

export async function SendProfileModification(
  approvedFields: ProfileUpdate,
  guestInboxUrl: string,
  session: Session = GetSession()
): Promise<void> {
  const profileModification = SerializeProfileModification(approvedFields);

  await saveSolidDatasetInContainer(guestInboxUrl, profileModification, {
    fetch: session.fetch,
  });
}
