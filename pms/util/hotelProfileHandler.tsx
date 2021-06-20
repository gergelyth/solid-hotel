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
import { Field } from "../../common/types/Field";
import { GetDataSet, GetProfileOf, GetSession } from "../../common/util/solid";
import { personFieldToRdfMap } from "../../common/vocabularies/rdf_person";
import { DataProtectionProfilesUrl } from "../../common/consts/solidIdentifiers";
import { useGuest } from "../../common/hooks/useGuest";

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

export async function MoveProfileToDataProtectionFolder(
  webId: string
): Promise<string> {
  const session = GetSession();

  const solidProfile = await GetProfileOf(webId);
  if (!solidProfile?.dataSet) {
    throw new Error(`Error retrieving solid profile with webId ${webId}`);
  }

  const dataProtectionDataset = await saveSolidDatasetInContainer(
    DataProtectionProfilesUrl,
    solidProfile?.dataSet,
    {
      fetch: session.fetch,
    }
  );

  deleteSolidDataset(solidProfile.profileAddress);

  return getSourceUrl(dataProtectionDataset) + `#${HotelProfileThingName}`;
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

  const profileThing = getThing(profileDataset, `#${HotelProfileThingName}`);
  if (!profileThing) {
    throw new Error(`Hotel profile thing null in ${hotelProfileUrl}`);
  }

  return profileThing;
}
