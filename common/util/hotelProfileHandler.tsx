import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  deleteSolidDataset,
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
import { useGuest } from "../hooks/useGuest";

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

  return getSourceUrl(savedDataset) + `#${HotelProfileThingName}`;
}

export async function CreateDataProtectionProfile(
  dataProtectionFields: string[],
  webId: string
): Promise<string> {
  const { guestFields, isLoading, isError } = useGuest(
    dataProtectionFields,
    webId
  );

  while (isLoading) {
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!guestFields || isError) {
    throw new Error(
      "Failed to retrieve data protection information from hotel profile"
    );
  }

  const dataProtectionDatasetWebId = CreateHotelProfile(
    guestFields,
    DataProtectionProfilesUrl
  );

  deleteSolidDataset(webId.split("#")[0]);

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
