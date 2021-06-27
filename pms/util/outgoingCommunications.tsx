import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SerializeFailureReport } from "../../common/notifications/FailureReport";
import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { SerializePairingRequestWithInformation } from "../../common/notifications/PairingRequestWithInformation";
import { ReservationState } from "../../common/types/ReservationState";
import { GetSession } from "../../common/util/solid";
import { GetHotelProfileThing } from "../../common/util/hotelProfileHandler";
import {
  GetOwnerAndAnonymizeInMemory,
  SaveInboxAndReturnReservation,
  SetInboxToHotelInboxInMemory,
} from "./pairingRequestUtil";

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
}
