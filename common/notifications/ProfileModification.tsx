import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  getThingAll,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { profileModificationRdfMap } from "../vocabularies/notification_payloads/rdf_profileModification";
import { ProfileUpdate } from "../util/tracker/trackerSendChange";

const thingName = "profileModification";

export function DeserializeProfileModification(dataset: SolidDataset): {
  [rdfName: string]: string;
} {
  const result: { [rdfName: string]: string } = {};
  const things = getThingAll(dataset);

  things.forEach((thing) => {
    const rdfModified = getStringNoLocale(
      thing,
      profileModificationRdfMap.fieldModified
    );
    if (!rdfModified) {
      //there will be the notification Thing here
      return;
    }

    const newFieldValue = getStringNoLocale(
      thing,
      profileModificationRdfMap.newFieldValue
    );
    if (!newFieldValue) {
      return;
    }

    result[rdfModified] = newFieldValue;
  });

  return result;
}

export function SerializeProfileModification(
  profileUpdate: ProfileUpdate
): SolidDataset {
  let changeDataset = createSolidDataset();

  const counter = 0;
  for (const rdfField in profileUpdate) {
    const details = profileUpdate[rdfField];

    let changeThing = createThing({ name: `${thingName}_${counter}` });
    changeThing = addStringNoLocale(
      changeThing,
      profileModificationRdfMap.fieldModified,
      rdfField
    );
    changeThing = addStringNoLocale(
      changeThing,
      profileModificationRdfMap.newFieldValue,
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
