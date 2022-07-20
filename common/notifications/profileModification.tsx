import {
  addStringNoLocale,
  addUrl,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  getThingAll,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { ProfileModificationRdfMap } from "../vocabularies/notificationpayloads/rdfProfileModification";
import { ProfileUpdate } from "../components/profilesync/tracker-send-change";
import { UtilRdfMap } from "../vocabularies/rdfUtil";

/** The prefix name of the profile changes Thing in the dataset. */
const thingName = "profileModification";

/**
 * Parses the notification dataset into a dictionary of profile change modifications, where the key is the RDF name of the field and the value is the new field value.
 * @returns The profile changes by RDF key.
 */
export function DeserializeProfileModification(dataset: SolidDataset): {
  [rdfName: string]: string;
} {
  const result: { [rdfName: string]: string } = {};
  const things = getThingAll(dataset);

  things.forEach((thing) => {
    const rdfModified = getStringNoLocale(
      thing,
      ProfileModificationRdfMap.fieldModified
    );
    if (!rdfModified) {
      //there will be the notification Thing here
      return;
    }

    const newFieldValue = getStringNoLocale(
      thing,
      ProfileModificationRdfMap.newFieldValue
    );
    if (!newFieldValue) {
      return;
    }

    result[rdfModified] = newFieldValue;
  });

  return result;
}

/**
 * Serializes the profile changes and creates a profile modification notification dataset with it.
 * @returns The profile modication notification dataset, where each Thing represent a change in one field.
 */
export function SerializeProfileModification(
  profileUpdate: ProfileUpdate
): SolidDataset {
  let changeDataset = createSolidDataset();

  const counter = 0;
  for (const rdfField in profileUpdate) {
    const details = profileUpdate[rdfField];

    let changeThing = createThing({ name: `${thingName}_${counter}` });
    changeThing = addUrl(
      changeThing,
      UtilRdfMap.type,
      ProfileModificationRdfMap.type
    );
    changeThing = addStringNoLocale(
      changeThing,
      ProfileModificationRdfMap.fieldModified,
      rdfField
    );
    changeThing = addStringNoLocale(
      changeThing,
      ProfileModificationRdfMap.newFieldValue,
      details.newValue
    );
    changeDataset = setThing(changeDataset, changeThing);
  }

  const notificationDataset = AddNotificationThingToDataset(
    changeDataset,
    NotificationType.ProfileModification
  );

  return notificationDataset;
}
