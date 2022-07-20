import {
  addInteger,
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getInteger,
  getStringNoLocale,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { ReservationState } from "../types/ReservationState";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { FailureReportRdfMap } from "../vocabularies/notificationpayloads/rdfFailureReport";
import { GetReservationIdFromInboxUrl } from "../util/urlParser";
import { GetThing } from "../util/solid";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

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
  const failureThing = GetThing(dataset, "failure");
  if (!failureThing) {
    throw new Error("Failure thing cannot be null");
  }

  const resultStateValue = getInteger(
    failureThing,
    FailureReportRdfMap.resultState
  );
  if (!resultStateValue) {
    throw new Error("Result state value is null in failure report");
  }
  const resultState: ReservationState = resultStateValue;

  const errorMessage = getStringNoLocale(
    failureThing,
    FailureReportRdfMap.errorMessage
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
  failureThing = addUrl(
    failureThing,
    UtilRdfMap.type,
    FailureReportRdfMap.type
  );
  failureThing = addStringNoLocale(
    failureThing,
    FailureReportRdfMap.errorMessage,
    errorMessage
  );
  failureThing = addInteger(
    failureThing,
    FailureReportRdfMap.resultState,
    resultReservationState.valueOf()
  );

  failureDataset = setThing(failureDataset, failureThing);
  const notificationDataset = AddNotificationThingToDataset(
    failureDataset,
    NotificationType.FailureReport
  );

  return notificationDataset;
}
