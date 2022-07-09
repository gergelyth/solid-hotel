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
