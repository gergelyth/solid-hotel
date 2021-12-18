import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSourceUrl,
  getThing,
  saveSolidDatasetInContainer,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { Field } from "../types/Field";
import { GetDataSet, GetSession } from "./solid";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";
import { DataProtectionProfilesUrl } from "../consts/solidIdentifiers";
import { CacheProfileFields } from "./tracker/profileCache";

const HotelProfileThingName = "hotelProfile";

export async function CreateHotelProfile(
  fields: Field[],
  containerUrl: string
): Promise<string> {
  const session = GetSession();

  let hotelProfileDataset = createSolidDataset();

  let hotelProfileThing = createThing({ name: HotelProfileThingName });
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
    containerUrl,
    hotelProfileDataset,
    {
      fetch: session.fetch,
    }
  );

  const profileUrl = getSourceUrl(savedDataset) + `#${HotelProfileThingName}`;
  await CacheProfileFields(profileUrl, fields);

  return profileUrl;
}

export async function CreateDataProtectionProfile(
  guestFields: Field[]
): Promise<string> {
  const dataProtectionDatasetWebId = CreateHotelProfile(
    guestFields,
    DataProtectionProfilesUrl
  );

  return dataProtectionDatasetWebId;
}

export async function GetHotelProfileThing(
  hotelProfileUrl: string
): Promise<Thing> {
  const session = GetSession();

  const profileDataset = await GetDataSet(hotelProfileUrl, session);

  const url = getSourceUrl(profileDataset);
  const profileThing = getThing(
    profileDataset,
    url + `#${HotelProfileThingName}`
  );
  if (!profileThing) {
    throw new Error(`Hotel profile thing null in ${hotelProfileUrl}`);
  }

  return profileThing;
}
