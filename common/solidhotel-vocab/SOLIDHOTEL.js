/**
 * Generated by the artifact generator [@inrupt/artifact-generator], version [2.0.0]
 * as part of artifact: [generated-vocab-solidhotel], version: [0.0.1]
 * on 'Tuesday, July 19, 2022 3:55 PM'.
 *
 * Vocabulary built from input: [./solidhotel.ttl].
 * The generator detected the following terms in the source vocabulary:
 *  - Classes: [5]
 *  - Properties: [8]
 *  - Literals: [0]
 *  - Constant IRIs: [0]
 *  - Constant strings: [0]
 *
 * The ontology adding RDF terms required for the Solid Hotel project.
 */

// We prefix our local variables with underscores to (hopefully!) prevent
// potential names clashes with terms from vocabularies.
const _NAMESPACE = "https://github.com/gergelyth/solid-hotel/blob/master/solidhotel.ttl#";
function _NS (localName) {
  return (_NAMESPACE + localName);
}

/**
 * The ontology adding RDF terms required for the Solid Hotel project.
 */
const SOLIDHOTEL = {
  PREFIX: "solidhotel",
  NAMESPACE: _NAMESPACE,
  PREFIX_AND_NAMESPACE: { "solidhotel": "https://github.com/gergelyth/solid-hotel/blob/master/solidhotel.ttl#" },
  NS: _NS,

  // *****************
  // All the Classes.
  // *****************

  /**
   * A resource containing information which helps to pair Solid Pods to reservations.
   *
   * This term provides descriptions only in English.
   */
  ReservationLink: _NS("ReservationLink"),

  /**
   * A resource helping to identify what personal information fields are kept at the hotel.
   *
   * This term provides descriptions only in English.
   */
  PrivacyToken: _NS("PrivacyToken"),

  /**
   * Enumerated type values for a Notification.
   *
   * This term provides descriptions only in English.
   */
  NotificationType: _NS("NotificationType"),

  /**
   * A resource containing information about the deletion request of a privacy token.
   *
   * This term provides descriptions only in English.
   */
  PrivacyTokenDeletion: _NS("PrivacyTokenDeletion"),

  /**
   * A resource containing information about a reservation state change.
   *
   * This term provides descriptions only in English.
   */
  ReservationStateChange: _NS("ReservationStateChange"),

  // *******************
  // All the Enumeration values
  // *******************

  /**
   * The status for a currently active reservation where the guest is checked-in.
   *
   * This term provides descriptions only in English.
   */
  ReservationActive: _NS("ReservationActive"),

  /**
   * The status for a reservation in the past where the guest has already checked-out.
   *
   * This term provides descriptions only in English.
   */
  ReservationPast: _NS("ReservationPast"),

  /**
   * The notification submitted to the hotel to create a reservation.
   *
   * This term provides descriptions only in English.
   */
  BookingRequestNotification: _NS("BookingRequestNotification"),

  /**
   * The notification requesting a reservation status change at the counterparty.
   *
   * This term provides descriptions only in English.
   */
  ReservationStateChangeNotification: _NS("ReservationStateChangeNotification"),

  /**
   * The notification reporting an error to the counterparty.
   *
   * This term provides descriptions only in English.
   */
  FailureReportNotification: _NS("FailureReportNotification"),

  /**
   * The notification reporting a change in a local guest profile to the counterparty.
   *
   * This term provides descriptions only in English.
   */
  ProfileModificationNotification: _NS("ProfileModificationNotification"),

  /**
   * The notification which starts the reservation pairing operation.
   *
   * This term provides descriptions only in English.
   */
  InitialPairingRequestNotification: _NS("InitialPairingRequestNotification"),

  /**
   * The notification completing the reservation pairing operation carrying the required data.
   *
   * This term provides descriptions only in English.
   */
  PairingRequestWithInformationNotification: _NS("PairingRequestWithInformationNotification"),

  /**
   * The notification informing the counterparty about a personal information held.
   *
   * This term provides descriptions only in English.
   */
  PrivacyTokenNotification: _NS("PrivacyTokenNotification"),

  /**
   * The notification submitted to request the removal of a personal information field.
   *
   * This term provides descriptions only in English.
   */
  PrivacyTokenDeletionNotification: _NS("PrivacyTokenDeletionNotification"),

  // *******************
  // All the Properties.
  // *******************

  /**
   * Defines if the subject has been processed already.
   *
   * This term provides descriptions only in English.
   */
  isProcessed: _NS("isProcessed"),

  /**
   * Defines the type of the notification
   *
   * This term provides descriptions only in English.
   */
  notificationType: _NS("notificationType"),

  /**
   * Defines the identification document type of the person.
   *
   * This term provides descriptions only in English.
   */
  idDocumentType: _NS("idDocumentType"),

  /**
   * Defines the identification document number of the person.
   *
   * This term provides descriptions only in English.
   */
  idDocumentNumber: _NS("idDocumentNumber"),

  /**
   * Refers to the target Solid dataset.
   *
   * This term provides descriptions only in English.
   */
  targetDataset: _NS("targetDataset"),

  /**
   * Refers to the target hotel of the dataset.
   *
   * This term provides descriptions only in English.
   */
  forHotel: _NS("forHotel"),

  /**
   * Refers to the target reservation in the Solid Pod.
   *
   * This term provides descriptions only in English.
   */
  forReservation: _NS("forReservation"),

  /**
   * The array of the personal information fields targeted by this resource.
   *
   * This term provides descriptions only in English.
   */
  targetFields: _NS("targetFields"),

}

module.exports = SOLIDHOTEL;
