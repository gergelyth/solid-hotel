import {
  addInteger,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getInteger,
  getStringNoLocale,
  getThing,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { ReservationState } from "../types/ReservationState";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { failureReportRdfMap } from "../vocabularies/notification_payloads/rdf_failureReport";
import { GetReservationIdFromInboxUrl } from "../util/urlParser";

/**
 * Parses the notification dataset into a failure report.
 * @returns The failure properties - the corresponding reservation ID, error message and the result state of the reservation.
 */
export function DeserializeFailureReport(
  url: string,
  dataset: SolidDataset
): {
  reservationId: string;
  errorMessage: string;
  resultState: ReservationState;
} {
  const failureThing = getThing(dataset, url + "#failure");
  if (!failureThing) {
    throw new Error("Failure thing cannot be null");
  }

  const resultStateValue = getInteger(
    failureThing,
    failureReportRdfMap.resultState
  );
  if (!resultStateValue) {
    throw new Error("Result state value is null in failure report");
  }
  const resultState: ReservationState = resultStateValue;

  const errorMessage = getStringNoLocale(
    failureThing,
    failureReportRdfMap.errorMessage
  );
  if (!errorMessage) {
    throw new Error("Error message is null in reservation change notification");
  }

  const reservationId = GetReservationIdFromInboxUrl(url);
  return { reservationId, errorMessage, resultState };
}

/**
 * Serializes the failure report with the error message and result reservation state and creates a FailureReport notification dataset with it.
 * @returns The failure report notification dataset.
 */
export function SerializeFailureReport(
  errorMessage: string,
  resultReservationState: ReservationState
): SolidDataset {
  let failureDataset = createSolidDataset();

  let failureThing = createThing({ name: "failure" });
  failureThing = addStringNoLocale(
    failureThing,
    failureReportRdfMap.errorMessage,
    errorMessage
  );
  failureThing = addInteger(
    failureThing,
    failureReportRdfMap.resultState,
    resultReservationState.valueOf()
  );

  failureDataset = setThing(failureDataset, failureThing);
  const notificationDataset = AddNotificationThingToDataset(
    failureDataset,
    NotificationType.FailureReport
  );

  return notificationDataset;
}
