import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getSourceUrl,
  setThing,
  Thing,
} from "@inrupt/solid-client";
import { Field } from "../types/Field";
import { GetDataSet, GetThing } from "./solid";
import { PersonFieldToRdfMap } from "../vocabularies/rdfPerson";
import { DataProtectionProfilesUrl } from "../consts/solidIdentifiers";
import { SafeSaveDatasetInContainer } from "./solidWrapper";
import { ShowError } from "./helpers";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/** The name of the Solid Thing containing the profile. */
const HotelProfileThingName = "hotelProfile";

/**
 * Creates the Solid dataset with the guest fields passed as argument.
 * Saves the dataset in the container whose URL was supplied.
 * @returns The URL of the saved profile Thing.
 */
export async function CreateHotelProfile(
  fields: Field[],
  containerUrl: string
): Promise<string> {
  let hotelProfileDataset = createSolidDataset();

  let hotelProfileThing = createThing({ name: HotelProfileThingName });
  hotelProfileThing = addUrl(
    hotelProfileThing,
    UtilRdfMap.type,
    PersonFieldToRdfMap.type
  );
  fields.forEach((field) => {
    if (!field.fieldValue) {
      throw new Error(
        `Guest profile validation failed. Field ${field.fieldShortName} doesn't have a value`
      );
    }
    hotelProfileThing = addStringNoLocale(
      hotelProfileThing,
      PersonFieldToRdfMap[field.fieldShortName],
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

/**
 * Creates the Solid dataset with the guest fields passed as argument for the purposes of data protection.
 * Saves the dataset in the container whose URL was supplied.
 * @returns The URL of the saved profile Thing.
 */
export async function CreateDataProtectionProfile(
  guestFields: Field[]
): Promise<string> {
  const dataProtectionDatasetWebId = CreateHotelProfile(
    guestFields,
    DataProtectionProfilesUrl
  );

  return dataProtectionDatasetWebId;
}

/**
 * Retrieves the profile Thing found in the dataset whose URL was passed to the function.
 * @returns The Solid Thing containing the hotel profile.
 */
export async function GetHotelProfileThing(
  hotelProfileUrl: string
): Promise<Thing> {
  const profileDataset = await GetDataSet(hotelProfileUrl);

  const profileThing = GetThing(profileDataset, HotelProfileThingName);
  if (!profileThing) {
    throw new Error(`Hotel profile thing null in ${hotelProfileUrl}`);
  }

  return profileThing;
}
