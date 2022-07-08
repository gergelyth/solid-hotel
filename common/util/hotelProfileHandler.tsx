import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getSourceUrl,
  getThing,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { Field } from "../types/Field";
import { GetDataSet } from "./solid";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";
import {
  DataProtectionProfilesUrl,
  LocalNodeSkolemPrefix,
} from "../consts/solidIdentifiers";
import { SafeSaveDatasetInContainer } from "./solid_wrapper";
import { ShowError } from "./helpers";

const HotelProfileThingName = "hotelProfile";

export async function CreateHotelProfile(
  fields: Field[],
  containerUrl: string
): Promise<string> {
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

  const savedDataset = await SafeSaveDatasetInContainer(
    containerUrl,
    hotelProfileDataset
  );
  if (!savedDataset) {
    ShowError("There was an issue saving the hotel profile dataset", false);
    return "";
  }

  const profileUrl = getSourceUrl(savedDataset) + `#${HotelProfileThingName}`;
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
  const profileDataset = await GetDataSet(hotelProfileUrl);

  const profileThing = getThing(
    profileDataset,
    LocalNodeSkolemPrefix + HotelProfileThingName
  );
  if (!profileThing) {
    throw new Error(`Hotel profile thing null in ${hotelProfileUrl}`);
  }

  return profileThing;
}
