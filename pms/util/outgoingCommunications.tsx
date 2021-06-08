import { saveSolidDatasetInContainer } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SerializeFailureReport } from "../../common/notifications/FailureReport";
import { SerializeReservationStateChange } from "../../common/notifications/ReservationStateChange";
import { ReservationState } from "../../common/types/ReservationState";
import { GetSession } from "../../common/util/solid";

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
