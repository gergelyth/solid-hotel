import { FieldNameToFieldMap } from "../../util/fields";
import { Field } from "../../types/Field";
import { CreateHotelProfile } from "../../util/hotelProfileHandler";
import {
  DataProtectionProfilesUrl,
  HotelProfilesUrl,
} from "../../consts/solidIdentifiers";
import { createContainerAt } from "@inrupt/solid-client";
import { GetSession } from "../../util/solid";

function GetActiveProfiles(): Record<string, string>[] {
  //because the hotel is in France
  const profiles: Record<string, string>[] = [
    {
      firstName: "Bob",
      lastName: "Ford",
      nationality: "English",
      email: "bob@ford.com",
      //   phone: "+40111222333",
      //   idDocumentType: "IDENTIFICATION_CARD",
      idDocumentNumber: "AA 784 GOE",
      //   idDocumentExpiry: "2027-10-17",
    },
    {
      firstName: "Mark",
      lastName: "Williams",
      nationality: "Spanish",
      email: "mark@williams.com",
      phone: "+40222333444",
      idDocumentType: "PASSPORT",
      idDocumentNumber: "BB 939 OAL",
      idDocumentExpiry: "2028-03-11",
    },
  ];

  return profiles;
}

function GetDataProtectionProfiles(): Record<string, string>[] {
  //because the hotel is in France
  const profiles: Record<string, string>[] = [
    {
      firstName: "John",
      lastName: "Smith",
      nationality: "English",
      email: "john@smith.com",
      //   phone: "+40123456789",
      //   idDocumentType: "IDENTIFICATION_CARD",
      idDocumentNumber: "ER 102 DJA",
      //   idDocumentExpiry: "2029-11-07",
    },
    {
      firstName: "Jessica",
      lastName: "Brown",
      nationality: "Danish",
      email: "jessica@danish.com",
      phone: "+40333444555",
      idDocumentType: "PASSPORT",
      idDocumentNumber: "CC 293 PAK",
      idDocumentExpiry: "2030-01-24",
    },
    {
      firstName: "Zach",
      lastName: "Hendricks",
      nationality: "Spanish",
      email: "zach@hendricks.com",
      //   phone: "+40999888777",
      idDocumentType: "PASSPORT",
      idDocumentNumber: "GU 191 PAS",
      //   idDocumentExpiry: "2023-02-12",
    },
    //Mark is meant to be the shared one (the guest)
    {
      firstName: "Mark",
      lastName: "Williams",
      nationality: "Spanish",
      email: "mark@williams.com",
      //   phone: "+40222333444",
      idDocumentType: "PASSPORT",
      idDocumentNumber: "BB 939 OAL",
      //   idDocumentExpiry: "2028-03-11",
    },
  ];

  return profiles;
}

async function CreateProfiles(
  profiles: Record<string, string>[],
  profilesContainer: string
): Promise<string[]> {
  const profileWebIds: string[] = [];

  const profilePromises = profiles.map((profile) => {
    const fields: Field[] = [];
    Object.entries(profile).forEach((record) => {
      const field = FieldNameToFieldMap[record[0]];
      field.fieldValue = record[1];
      fields.push(field);
    });

    return CreateHotelProfile(fields, profilesContainer).then(
      (hotelProfileWebId) => profileWebIds.push(hotelProfileWebId)
    );
  });

  await Promise.all(profilePromises);

  return profileWebIds;
}

export async function PopulateHotelPodWithActiveProfiles(): Promise<string[]> {
  const session = GetSession();
  await createContainerAt(HotelProfilesUrl, { fetch: session.fetch });

  const activeProfiles = GetActiveProfiles();
  const activeProfileWebIds = await CreateProfiles(
    activeProfiles,
    HotelProfilesUrl
  );
  return activeProfileWebIds;
}

export async function PopulateHotelPodWithDataProtectionProfiles(): Promise<
  string[]
> {
  const session = GetSession();
  await createContainerAt(DataProtectionProfilesUrl, { fetch: session.fetch });

  const dataProtectionProfiles = GetDataProtectionProfiles();
  const dataProtectionProfileWebIds = await CreateProfiles(
    dataProtectionProfiles,
    DataProtectionProfilesUrl
  );
  return dataProtectionProfileWebIds;
}
