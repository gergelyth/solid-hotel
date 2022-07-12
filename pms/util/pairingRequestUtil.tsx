import {
  getStringNoLocale,
  getThing,
  saveSolidDatasetAt,
  setStringNoLocale,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { RevalidateGuest } from "../../common/hooks/useGuest";
import { GetDataSet, GetSession } from "../../common/util/solid";
import { reservationFieldToRdfMap } from "../../common/vocabularies/rdf_reservation";

/**
 * Fetches the reservation from the hotel Pod and updates the guest inbox URL in it with the new value passed.
 * @returns The reservation Solid Thing with the modified inbox.
 */
export async function SaveInboxAndReturnReservation(
  reservationUrl: string,
  guestInboxUrl: string
): Promise<Thing> {
  const session = GetSession();
  let reservationDataset = await GetDataSet(reservationUrl);
  let reservationThing = getThing(
    reservationDataset,
    reservationUrl + "#reservation"
  );
  if (!reservationThing) {
    throw new Error(
      `Reservation thing null in reservation dataset ${reservationUrl}`
    );
  }

  reservationThing = setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.inbox,
    guestInboxUrl
  );

  reservationDataset = setThing(reservationDataset, reservationThing);

  saveSolidDatasetAt(reservationUrl, reservationDataset, {
    fetch: session.fetch,
  });

  return reservationThing;
}

/**
 * Updates the inbox field to be the hotel inbox URL passed to the function.
 * @returns The update reservation Solid Thing.
 */
export function SetInboxToHotelInboxInMemory(
  reservationThing: Thing,
  hotelInboxUrl: string
): Thing {
  return setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.inbox,
    hotelInboxUrl
  );
}

/**
 * Anonymizes the owner field in the reservation Solid Thing passed but doesn't save it to the Pod.
 * @returns The updated reservation Solid Thing as well as the hotel profile URL that was contained in the owner field before anonymized.
 */
export function GetOwnerAndAnonymizeInMemory(reservationThing: Thing): {
  anonymizedReservationThing: Thing;
  hotelProfileOwnerUrl: string;
} {
  const hotelProfileOwnerUrl = getStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.owner
  );
  if (!hotelProfileOwnerUrl) {
    throw new Error("Owner ID null in reservation");
  }

  reservationThing = setStringNoLocale(
    reservationThing,
    reservationFieldToRdfMap.owner,
    "Anonymized"
  );
  RevalidateGuest(undefined, hotelProfileOwnerUrl);

  return {
    anonymizedReservationThing: reservationThing,
    hotelProfileOwnerUrl: hotelProfileOwnerUrl,
  };
}
