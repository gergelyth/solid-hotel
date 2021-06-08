import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  saveSolidDatasetInContainer,
  setThing,
} from "@inrupt/solid-client";
import { Field } from "../../common/types/Field";
import { GetSession } from "../../common/util/solid";
import { personFieldToRdfMap } from "../../common/vocabularies/rdf_person";
import { HotelProfilesUrl } from "../../common/consts/solidIdentifiers";

export async function CreateHotelProfile(fields: Field[]): Promise<string> {
  const session = GetSession();

  let hotelProfileDataset = createSolidDataset();

  let hotelProfileThing = createThing({ name: "hotelProfile" });
  fields.forEach((field) => {
    if (!field.fieldValue) {
      throw new Error(
        `Guest profile validation failed. Field ${field.fieldShortName} doesn't have a value`
      );
    }
    hotelProfileThing = addStringNoLocale(
      hotelProfileThing,
      personFieldToRdfMap[field.fieldShortName],
      field.fieldValue
    );
  });

  hotelProfileDataset = setThing(hotelProfileDataset, hotelProfileThing);

  const savedDataset = await saveSolidDatasetInContainer(
    HotelProfilesUrl,
    hotelProfileDataset,
    {
      fetch: session.fetch,
    }
  );

  return savedDataset.internal_resourceInfo.sourceIri;
}
